import setDates from "./setDates";
import { authenticatedFetch } from "./authenticatedFetch";
import { Event } from "@/types";

interface SDHMEventData {
  data?: Event[];
  [key: string]: any;
}

/**
 * Simple wrapper for SDHM events data (processing now done on API side)
 *
 * NOTE: As of the latest update, all event processing (sorting, deduplication,
 * transformation, artist matching, and filtering) is now done on the API side
 * in /api/sdhm/[...params].js for better caching and performance.
 */
export const processSDHMEvents = (
  processedEvents: Event[],
  _city: string = ""
): Event[] => {
  if (!Array.isArray(processedEvents) || processedEvents.length === 0) {
    return [];
  }

  // Events are already processed on the API side, just return them
  // This function is kept for backward compatibility
  return processedEvents;
};

/**
 * Fetch and process events from SDHM API for a specific location
 */
export const getSDHMEvents = async (
  locationId: number,
  city: string
): Promise<Event[]> => {
  try {
    // Check if we're running on the server-side (Node.js environment)
    const isServerSide = typeof window === "undefined";

    if (isServerSide) {
      // Server-side: Use authenticated fetch with internal token
      const apiUrl = `/api/sdhm/${locationId}/${city}`;
      const data = await authenticatedFetch<SDHMEventData>(apiUrl);

      // Events are already processed on the API side
      const processedEvents = data.data || [];

      // Use the wrapper function for consistency (events already processed)
      return processSDHMEvents(processedEvents, city);
    } else {
      // Client-side: This shouldn't happen in normal usage, but handle gracefully
      console.warn(
        "getSDHMEvents called from client-side - this may not work due to authentication requirements"
      );

      const protocol = window.location.protocol;
      const host = window.location.host;
      const apiUrl = `${protocol}//${host}/api/sdhm/${locationId}/${city}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error(`SDHM API error: ${response.status}`);
        return [];
      }

      const data: SDHMEventData = await response.json();

      // Events are already processed on the API side
      const processedEvents = data.data || [];

      // Use the wrapper function for consistency (events already processed)
      return processSDHMEvents(processedEvents, city);
    }
  } catch (error) {
    console.error("Error fetching SDHM events:", error);
    return [];
  }
};

/**
 * Frontend-safe version of getSDHMEvents that uses the proxy endpoint
 */
export const getSDHMEventsClient = async (
  locationId: number,
  city: string
): Promise<Event[]> => {
  try {
    const protocol =
      typeof window !== "undefined" ? window.location.protocol : "http:";
    const host =
      typeof window !== "undefined" ? window.location.host : "localhost:3000";
    const apiUrl = `${protocol}//${host}/api/frontend/events/${locationId}/${encodeURIComponent(
      city
    )}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Frontend events API error: ${response.status}`);
      return [];
    }

    const data: SDHMEventData = await response.json();

    // Events are already processed on the API side
    const processedEvents = data.data || [];

    // Use the wrapper function for consistency (events already processed)
    return processSDHMEvents(processedEvents, city);
  } catch (error) {
    console.error("Error fetching SDHM events from frontend:", error);
    return [];
  }
};

/**
 * Parse and format events data for display
 * Used by getArtists.ts which parses EDMTrain API responses
 * Adds isVisible flag and formattedDate field to each event
 */
export const parseData = (data: any[]): Event[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    // sets all to be visible
    item.isVisible = true;
    // add a formatted date for Search
    item.formattedDate = setDates(item.date).dayMonthYear;

    return item;
  });
};
