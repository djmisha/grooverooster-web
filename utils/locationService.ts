import locations from "@/utils/locations.json";
import { Location } from "@/types";
import { setCookie as setSecureCookie, getCookie } from "@/utils/cookieUtils";

const LOCATION_COOKIE_NAME = "userLocation";

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Find the closest location from coordinates
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns Closest location object or null if none found
 */
export const findClosestLocation = (
  latitude: number,
  longitude: number
): any | null => {
  if (!latitude || !longitude || !locations?.length) {
    return null;
  }

  let closestLocation: any = null;
  let shortestDistance = Infinity;

  // First pass: Look for exact city matches within reasonable distance
  for (const location of locations) {
    if (location.city && location.latitude && location.longitude) {
      const distance = calculateDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude
      );

      // Prioritize city matches within 100km
      if (distance < 100 && distance < shortestDistance) {
        closestLocation = location;
        shortestDistance = distance;
      }
    }
  }

  // If no close city found, find closest state/province
  if (!closestLocation) {
    for (const location of locations) {
      if (location.latitude && location.longitude) {
        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );

        if (distance < shortestDistance) {
          closestLocation = location;
          shortestDistance = distance;
        }
      }
    }
  }

  return closestLocation;
};

/**
 * Create standardized location object
 * @param locationData - Raw location data
 * @returns Standardized location object
 */
export const createLocationObject = (locationData: any): Location | null => {
  if (!locationData) return null;

  return {
    id: locationData.id,
    city: locationData.city,
    state: locationData.state,
    stateCode: locationData.stateCode,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
  };
};

/**
 * Get user's current position using browser geolocation
 * @returns Promise resolving to coordinates object
 */
export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = "Unknown error occurred";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Detect user location and find closest match
 * @returns Promise resolving to location object or null
 */
export const detectUserLocation = async (): Promise<Location | null> => {
  try {
    const coordinates = await getCurrentPosition();
    const closestLocation = findClosestLocation(
      coordinates.latitude,
      coordinates.longitude
    );

    if (closestLocation) {
      return createLocationObject(closestLocation);
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.warn("Location detection failed:", error.message);
    }
    throw error;
  }
};

/**
 * Save location to cookie
 * @param location - Location object to save
 */
export const saveLocationToCookie = (location: Location | null): void => {
  if (!location) return;

  try {
    // Use secure cookie settings for location data
    setSecureCookie(LOCATION_COOKIE_NAME, location, { days: 365 }); // Save for 1 year
  } catch (error) {
    console.error("Failed to save location to cookie:", error);
  }
};

/**
 * Get saved location from cookie
 * @returns Saved location object or null
 */
export const getSavedLocation = (): Location | null => {
  try {
    return getCookie(LOCATION_COOKIE_NAME);
  } catch (error) {
    console.error("Failed to get saved location:", error);
    return null;
  }
};

/**
 * Update user location and save to cookie
 * @param location - New location object
 */
export const updateUserLocation = (
  location: Location
): Location | undefined => {
  if (!location) return;

  saveLocationToCookie(location);
  return createLocationObject(location) || undefined;
};

/**
 * Get location by ID from locations.json
 * @param locationId - Location ID
 * @returns Location object or null if not found
 */
export const getLocationById = (
  locationId: string | number
): Location | null => {
  if (!locationId || !locations?.length) return null;

  const location = locations.find((loc) => loc.id === locationId);
  return location ? createLocationObject(location) : null;
};

/**
 * Search locations by city or state name
 * @param searchTerm - Search term
 * @returns Array of matching locations
 */
export const searchLocations = (searchTerm: string): Location[] => {
  if (!searchTerm || !locations?.length) return [];

  const term = searchTerm.toLowerCase().trim();

  return locations
    .filter((location) => {
      const cityMatch = location.city?.toLowerCase().includes(term);
      const stateMatch = location.state?.toLowerCase().includes(term);
      return cityMatch || stateMatch;
    })
    .map(createLocationObject)
    .filter((loc): loc is Location => loc !== null);
};

/**
 * Legacy compatibility functions
 */

// Convert string to URL-friendly slug
export const toSlug = (string: string): string => {
  return string.split(" ").join("-").toLowerCase();
};

// Create internal events URL path for a location
export const getLocationEventsUrl = (
  location: Location | null
): string | null => {
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

// Validate if a location has a valid URL path
export const hasValidLocationUrl = (location: Location | null): boolean => {
  return !!(location && (location.city || location.state));
};

// Maintain compatibility with existing getUserLocation.js functions
export const getLocationId = (
  locations: any[],
  city: string,
  state: string
): string | number | undefined => {
  let id: string | number | undefined;

  locations.forEach(function (location) {
    if (city === location.city) {
      id = location.id;
    }
    if (!id && state === location.stateCode) {
      id = location.id;
    }
  });

  return id;
};

// Enhanced version of UserLocationService using IP-based detection
export const UserLocationService = async (): Promise<Location | null> => {
  try {
    const url = "https://api.ipify.org?format=json";
    const response = await fetch(url);
    const jsonData = await response.json();

    const ip = jsonData.ip;
    const locationURL = `https://ipapi.co/${ip}/json/`;
    const locationResponse = await fetch(locationURL);
    const locationData = await locationResponse.json();
    const { city, region_code: state } = locationData;

    const id = getLocationId(locations, city, state);

    if (id) {
      const locationObj = locations.find((loc) => loc.id === id);
      return createLocationObject(locationObj);
    }

    return null;
  } catch (error) {
    console.error("IP-based location service failed:", error);
    throw error;
  }
};
