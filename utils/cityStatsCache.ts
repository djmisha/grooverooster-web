/**
 * City Statistics Cache
 *
 * A server-side in-process Map that caches computed city activity statistics
 * for 24 hours. Data is populated the first time an events page is loaded for
 * a given location, then reused on subsequent homepage renders without hitting
 * any external API.
 *
 * Architecture note:
 * ------------------
 * This module uses a module-level singleton Map.  In a standard Node.js server
 * this Map is shared across all requests in the same process.  On Vercel's
 * serverless platform each function instance has its own Map; the cache will be
 * empty on cold starts but will fill up naturally as event pages are visited
 * within the same warm instance.  This matches the issue requirement of keeping
 * all the performance by *not* hitting external APIs again after the first load.
 *
 * Cache TTL: 24 hours (matching the events page refresh cycle).
 * Sync: The cache TTL should be kept in sync with the events API cache headers
 *        (currently 12 h s-maxage + 24 h stale-while-revalidate in
 *        /api/sdhm/[...params]/route.ts).
 */

import { CityStats, computeCityStats } from "@/utils/cityStats";
import { Event } from "@/types";

/** Cache TTL in milliseconds (24 hours) */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Module-level singleton cache — keyed by location slug */
const cityStatsCache = new Map<string, CityStats>();

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
};
