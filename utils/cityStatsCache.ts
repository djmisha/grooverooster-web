/**
 * City stats cache module.
 * Stores event counts per city/location with a 24-hour TTL.
 * The cache is populated gradually as city pages are visited — no bulk
 * prefetch is performed. Only event counts (not full event data) are stored.
 */

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CityStatEntry {
  /** Number of upcoming events for this location */
  count: number;
  /** City name, if applicable */
  city?: string;
  /** State / province name */
  state?: string;
  /** URL slug, e.g. "san-diego" */
  slug?: string;
  /** Unix timestamp (ms) when this entry was last written */
  updatedAt: number;
}

/** Module-level Map — one entry per numeric location ID. */
const cityStatsMap = new Map<number, CityStatEntry>();

/**
 * Write (or overwrite) the event count for a location.
 * @param locationId - Numeric location identifier
 * @param count      - Number of upcoming events
 * @param city       - City name (undefined for state-only locations)
 * @param state      - State / province name
 * @param slug       - URL slug for the location page
 */
export const updateCityStats = (
  locationId: number,
  count: number,
  city?: string,
  state?: string,
  slug?: string
): void => {
  cityStatsMap.set(locationId, {
    count,
    city,
    state,
    slug,
    updatedAt: Date.now(),
  });
};

/**
 * Read the cached stats for a single location.
 * Returns `undefined` when the entry does not exist or has expired.
 */
export const getCityStats = (locationId: number): CityStatEntry | undefined => {
  const entry = cityStatsMap.get(locationId);
  if (!entry) return undefined;

  if (Date.now() - entry.updatedAt > CACHE_TTL_MS) {
    cityStatsMap.delete(locationId);
    return undefined;
  }

  return entry;
};

/**
 * Return all non-expired entries as a plain object keyed by location ID.
 * Expired entries are evicted as a side-effect.
 */
export const getAllCityStats = (): Record<number, CityStatEntry> => {
  const now = Date.now();
  const result: Record<number, CityStatEntry> = {};

  for (const [id, entry] of cityStatsMap.entries()) {
    if (now - entry.updatedAt <= CACHE_TTL_MS) {
      result[id] = entry;
    } else {
      cityStatsMap.delete(id);
    }
  }

  return result;
};
