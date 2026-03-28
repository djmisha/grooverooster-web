import { authenticatedFetch } from "./authenticatedFetch";
import { Venue } from "@/types";

interface SDHMVenueData {
  data?: Venue;
  [key: string]: any;
}

/**
 * Fetch venue data from SDHM API by venue name
 */
export const getVenueData = async (
  venueName: string
): Promise<Venue | null> => {
  try {
    // Check if we're running on the server-side (Node.js environment)
    const isServerSide = typeof window === "undefined";

    if (isServerSide) {
      // Server-side: Use authenticated fetch with internal token
      const apiUrl = `/api/sdhm/venues/${encodeURIComponent(venueName)}`;
      const data = await authenticatedFetch<SDHMVenueData>(apiUrl);

      return data.data || null;
    } else {
      // Client-side: This shouldn't happen in normal usage, but handle gracefully
      console.warn(
        "getVenueData called from client-side - this may not work due to authentication requirements"
      );

      const protocol = window.location.protocol;
      const host = window.location.host;
      const apiUrl = `${protocol}//${host}/api/sdhm/venues/${encodeURIComponent(
        venueName
      )}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error(`SDHM Venues API error: ${response.status}`);
        return null;
      }

      const data: SDHMVenueData = await response.json();
      return data.data || null;
    }
  } catch (error) {
    console.error("Error fetching venue data:", error);
    return null;
  }
};
