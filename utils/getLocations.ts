import locations from "./locations.json";
import { Location } from "../types";

interface LocationWithSlug extends Location {
  slug: string;
}

interface CityInfo {
  id: string | number;
  name: string;
  slug: string;
  state: string;
}

interface StateInfo {
  id: string | number;
  name: string;
  slug: string;
  cities: CityInfo[];
  hasCities: boolean;
}

/**
 * Converts a string to a URL-friendly slug
 * @param string - The string to convert to a slug
 * @returns Lowercase string with spaces replaced by dashes
 */
// replace space with dash & lowercase
export const toSlug = (string: string): string => {
  return string.split(" ").join("-").toLowerCase();
};

/**
 * Separates locations into cities and states, then sorts and combines them
 * @param locations - Array of location objects containing city/state data
 * @returns Combined array with cities first (alphabetically), then states (alphabetically)
 */
// add city and state to the locations array
const addCityAndState = (locations: any[]): any[] => {
  const cities: any[] = [];
  const states: any[] = [];
  const cityAndState: any[] = [];
  // add city
  locations.map((location) => {
    if (location.city) cities.push(location);
  });
  // add States
  locations.map((location) => {
    if (!location.city) states.push(location);
  });

  // sort the arrays alphabetically
  cities.sort((a, b) => {
    if (a.city < b.city) return -1;
    if (a.city > b.city) return 1;
    return 0;
  });

  states.sort((a, b) => {
    if (a.state < b.state) return -1;
    if (a.state > b.state) return 1;
    return 0;
  });

  // join the arrays into a single array
  cities.map((city) => {
    cityAndState.push(city);
  });
  states.map((state) => {
    cityAndState.push(state);
  });

  return cityAndState;
};

export const allLocations = addCityAndState(locations);

/**
 * Gets all locations with slugs for homepage display
 * @returns Array of location objects with id, city, state, and slug properties
 */
// gets all locations for homepage
export const getLocations = (): LocationWithSlug[] => {
  return allLocations.map((location) => {
    const { id, city, state } = location;
    let slug: string;
    if (location.city) slug = toSlug(location.city);
    if (!location.city) slug = toSlug(location.state);
    return {
      id,
      city,
      state,
      slug,
    };
  });
};

/**
 * Matches a slug with location data and returns location information
 * @param slug - URL slug to match (e.g., "san-diego" or "california")
 * @returns Location data object with slug and matching location properties
 */
// Matches Slug with Location and returns data about location
export const getLocationData = (slug: string): any => {
  let cityData = null;
  let stateData = null;

  // First pass: collect all matches
  allLocations.forEach((location) => {
    if (location.city && toSlug(location.city) === slug) {
      cityData = location;
    }
    if (!location.city && toSlug(location.state) === slug) {
      stateData = location;
    }
  });

  // Prioritize city matches over state matches
  const data = cityData || stateData;

  return {
    slug,
    ...data,
  };
};

/**
 * Creates internal events URL path for a location
 * @param location - Location object with city or state property
 * @returns URL path in format "/events/slug" or null if invalid
 */
// Create internal events URL path for a location
export const getLocationEventsUrl = (location: Location | null): string | null => {
  if (!location) return null;

  let slug: string;

  // Prioritize city if available, otherwise use state
  if (location.city) {
    slug = toSlug(location.city);
  } else if (location.state) {
    slug = toSlug(location.state);
  } else {
    return null;
  }

  return `/events/${slug}`;
};

/**
 * Gets location slug for URL generation
 * @param location - Location object with city or state property
 * @returns URL slug or null if invalid
 */
// Get location slug for URL generation
export const getLocationSlug = (location: Location | null): string | null => {
  if (!location) return null;

  // Prioritize city if available, otherwise use state
  if (location.city) {
    return toSlug(location.city);
  } else if (location.state) {
    return toSlug(location.state);
  }

  return null;
};

/**
 * Validates if a location has a valid URL path
 * @param location - Location object to validate
 * @returns True if location has a city or state, false otherwise
 */
// Validate if a location has a valid URL path
export const hasValidLocationUrl = (location: Location | null): boolean => {
  return !!(location && (location.city || location.state));
};

/**
 * Checks if a slug corresponds to a state (not a city)
 * @param slug - URL slug to check
 * @returns True if slug represents a state, false otherwise
 */
// Check if a slug corresponds to a state (not a city)
export const isStateLandingPage = (slug: string): boolean => {
  const stateEntry = allLocations.find(
    (location) => !location.city && toSlug(location.state) === slug
  );
  return !!stateEntry;
};

/**
 * Gets all cities within a specific state
 * @param stateSlug - URL slug of the state
 * @returns Array of city objects with id, name, slug, and state properties
 */
// Get all cities within a specific state
export const getCitiesInState = (stateSlug: string): CityInfo[] => {
  // First find the state name from the slug
  const stateEntry = allLocations.find(
    (location) => !location.city && toSlug(location.state) === stateSlug
  );

  if (!stateEntry) return [];

  // Get all cities in that state
  const cities = allLocations
    .filter((location) => location.city && location.state === stateEntry.state)
    .map((location) => ({
      id: location.id,
      name: location.city,
      slug: toSlug(location.city),
      state: location.state,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return cities;
};

/**
 * Gets state information including all cities within that state
 * @param stateSlug - URL slug of the state
 * @returns State info object with id, name, slug, cities array, and hasCities flag, or null if not found
 */
// Get state information from slug
export const getStateInfo = (stateSlug: string): StateInfo | null => {
  const stateEntry = allLocations.find(
    (location) => !location.city && toSlug(location.state) === stateSlug
  );

  if (!stateEntry) return null;

  const cities = getCitiesInState(stateSlug);

  return {
    id: stateEntry.id,
    name: stateEntry.state,
    slug: stateSlug,
    cities: cities,
    hasCities: cities.length > 0,
  };
};
