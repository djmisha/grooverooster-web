/**
 * City Statistics Utility
 *
 * Calculates activity statistics for a city based on its events data.
 * These statistics are used for the City Activity Module on the homepage.
 *
 * Ranking Algorithm:
 * The city activity score prioritizes (in order):
 *  1. Unique venues  (×5) — diversity of scene
 *  2. Unique artists (×4) — depth of talent pool
 *  3. Festivals      (×3) — large-scale special events
 *  4. Series         (×2) — recurring / consistent events
 *  5. Shows          (×1) — total upcoming dates
 */

import { Event } from "@/types";

export interface CityStats {
  /** Display name for the city */
  city: string;
  /** State name */
  state: string;
  /** URL slug used in /events/[slug] routes */
  slug: string;
  /** Internal location ID */
  locationId: string | number;
  /** Total upcoming shows */
  shows: number;
  /** Number of unique artists across all shows */
  artists: number;
  /** Number of unique venues hosting shows */
  venues: number;
  /** Number of festival events (festivalind === true) */
  festivals: number;
  /** Number of distinct recurring series (event names that appear > 1 time) */
  series: number;
  /** Computed ranking score — higher is more active */
  score: number;
  /** Unix timestamp (ms) of when this entry was last computed */
  lastUpdated: number;
}

/**
 * Computes city activity statistics from an array of events.
 *
 * @param city - Display city name
 * @param state - Display state name
 * @param slug - URL slug (e.g. "austin-texas")
 * @param locationId - Internal location identifier
 * @param events - Processed event array for this city
 * @returns CityStats object with all computed statistics
 */
export const computeCityStats = (
  city: string,
  state: string,
  slug: string,
  locationId: string | number,
  events: Event[]
): CityStats => {
  const uniqueVenues = new Set<string>();
  const uniqueArtists = new Set<string>();
  const eventNameCounts: Record<string, number> = {};
  let festivals = 0;

  events.forEach((event) => {
    // Count unique venues
    if (event.venue?.name) {
      uniqueVenues.add(event.venue.name.toLowerCase());
    }

    // Count unique artists (support both camelCase and lowercase field names)
    const artistList = event.artistlist || event.artistList || [];
    artistList.forEach((artist) => {
      if (artist.name) {
        uniqueArtists.add(artist.name.toLowerCase());
      }
    });

    // Count festivals
    if (event.festivalind === true || event.festivalInd === true) {
      festivals += 1;
    }

    // Track event name occurrences for series detection
    if (event.name) {
      eventNameCounts[event.name] = (eventNameCounts[event.name] || 0) + 1;
    }
  });

  // Series = distinct event names that appear more than once (recurring events)
  const series = Object.values(eventNameCounts).filter(
    (count) => count > 1
  ).length;

  const venueCount = uniqueVenues.size;
  const artistCount = uniqueArtists.size;

  // Ranking score: venues > artists > festivals > series > shows
  const score =
    venueCount * 5 +
    artistCount * 4 +
    festivals * 3 +
    series * 2 +
    events.length * 1;

  return {
    city,
    state,
    slug,
    locationId,
    shows: events.length,
    artists: artistCount,
    venues: venueCount,
    festivals,
    series,
    score,
    lastUpdated: Date.now(),
  };
};
