/**
 * City Statistics Cache
 *
 * A server-side in-process Map that caches computed city activity statistics
 * for 24 hours. The cache is self-populating: when the API route reads the
 * cache and finds it empty (e.g. on a cold start), it calls
 * `populateCacheFromAPI()` which fetches events for all known cities from the
 * external SDHM API in parallel and computes stats on the spot.
 *
 * Architecture note:
 * ------------------
 * On Vercel's serverless platform each function instance has its own Map.
 * Because the events page and the city-stats API route run in different
 * function instances, the events-page population path is kept as a
 * secondary optimisation but the API route no longer depends on it.
 *
 * Cache TTL: 24 hours (matching the events page refresh cycle).
 * Sync: The cache TTL should be kept in sync with the events API cache headers
 *        (currently 12 h s-maxage + 24 h stale-while-revalidate in
 *        /api/sdhm/[...params]/route.ts).
 */

import { CityStats, computeCityStats } from "@/utils/cityStats";
import { Event } from "@/types";
import { getLocations, toSlug } from "@/utils/getLocations";

/** Cache TTL in milliseconds (24 hours) */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Cooldown between population attempts in milliseconds (5 minutes) */
const POPULATE_COOLDOWN_MS = 5 * 60 * 1000;

/** Module-level singleton cache — keyed by location slug */
const cityStatsCache = new Map<string, CityStats>();

/** Timestamp of the last population attempt (prevents hammering) */
let lastPopulateAttempt = 0;

/** Mutex: a shared Promise that concurrent callers can await */
let populatingPromise: Promise<void> | null = null;

/**
 * Returns true when a cache entry has expired.
 */
export const isCacheEntryExpired = (entry: CityStats): boolean => {
  return Date.now() - entry.lastUpdated > CACHE_TTL_MS;
};

/**
 * Computes city stats from the provided events and stores them in the cache.
 * If an unexpired entry already exists for this slug, the update is skipped to
 * avoid re-processing the same data within the same cache window.
 *
 * @param city - Display city name
 * @param state - Display state name
 * @param slug - URL slug matching /events/[slug]
 * @param locationId - Internal location identifier
 * @param events - Fully processed event array for this location
 */
export const updateCityStatsCache = (
  city: string,
  state: string,
  slug: string,
  locationId: string | number,
  events: Event[]
): void => {
  try {
    const existing = cityStatsCache.get(slug);

    // Skip update if unexpired entry already present
    if (existing && !isCacheEntryExpired(existing)) {
      return;
    }

    if (!Array.isArray(events) || events.length === 0) {
      return;
    }

    const stats = computeCityStats(city, state, slug, locationId, events);
    cityStatsCache.set(slug, stats);
  } catch (error) {
    // Cache updates are best-effort — never break the events page
    console.error("[CityStatsCache] Failed to update cache entry:", error);
  }
};

/**
 * Returns all cached city stats, sorted from most active to least active.
 * Expired entries are filtered out automatically.
 */
export const getCachedCityStats = (): CityStats[] => {
  const validEntries: CityStats[] = [];

  cityStatsCache.forEach((entry) => {
    if (!isCacheEntryExpired(entry)) {
      validEntries.push(entry);
    }
  });

  // Sort by score descending (most active first)
  return validEntries.sort((a, b) => b.score - a.score);
};

/**
 * Returns the cached stats for a single city slug, or null if not present /
 * expired.
 */
export const getCityStatsBySlug = (slug: string): CityStats | null => {
  const entry = cityStatsCache.get(slug);
  if (!entry || isCacheEntryExpired(entry)) return null;
  return entry;
};

/**
 * Clears all entries from the cache.
 * Primarily useful in tests.
 */
export const clearCityStatsCache = (): void => {
  cityStatsCache.clear();
  lastPopulateAttempt = 0;
  populatingPromise = null;
};

/**
 * Fetches events for a single city directly from the external SDHM API.
 * This bypasses the internal `/api/sdhm/` route so there are no
 * cross-environment auth or base-URL issues.
 *
 * @returns Raw events array, or empty array on failure.
 */
const fetchEventsForCity = async (
  locationId: string | number,
  city: string
): Promise<Event[]> => {
  const apiKey = process.env.API_KEY_SDHM;
  const apiUrl = process.env.API_URL_SDHM;

  if (!apiKey || !apiUrl) return [];

  try {
    const encodedCity = encodeURIComponent(
      (typeof city === "string" ? city : "").toLowerCase()
    );
    const url = `${apiUrl}/${locationId}/${encodedCity}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      signal: AbortSignal.timeout(10_000), // 10 s per-city timeout
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    // Silently skip cities that fail (network error, timeout, etc.)
    return [];
  }
};

/**
 * Populates the in-memory cache by fetching events for all known city
 * locations directly from the external SDHM API.  Cities are fetched in
 * parallel for speed.
 *
 * Guards:
 *  - 5-minute cooldown between attempts (prevents hammering on repeated
 *    homepage loads while the cache is still empty).
 *  - Shared Promise so concurrent callers await the same run rather than
 *    getting an empty cache while population is in progress.
 *  - Individual city failures are silently skipped.
 */
export const populateCacheFromAPI = async (): Promise<void> => {
  // Cooldown: don't retry too soon after a previous attempt
  if (Date.now() - lastPopulateAttempt < POPULATE_COOLDOWN_MS) return;

  // If a population run is already in progress, await it instead of skipping
  if (populatingPromise) {
    await populatingPromise;
    return;
  }

  lastPopulateAttempt = Date.now();

  const run = async (): Promise<void> => {
    try {
      // Get all city-level locations (filter out state-only entries)
      const allLocs = getLocations().filter((loc) => !!loc.city);
      let citiesWithEvents = 0;

      // Fetch events for all cities in parallel
      await Promise.allSettled(
        allLocs.map(async (loc) => {
          const events = await fetchEventsForCity(loc.id, loc.city || "");
          if (events.length > 0 && loc.city) {
            const slug = toSlug(loc.city);
            const stats = computeCityStats(
              loc.city,
              loc.state,
              slug,
              loc.id,
              events
            );
            cityStatsCache.set(slug, stats);
            citiesWithEvents += 1;
          }
        })
      );

      console.log(
        `[CityStatsCache] Populated ${citiesWithEvents} cities with events (${allLocs.length} total locations checked)`
      );
    } catch (error) {
      console.error("[CityStatsCache] Population failed:", error);
    } finally {
      populatingPromise = null;
    }
  };

  populatingPromise = run();
  await populatingPromise;
};
