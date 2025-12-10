import artistDB from "./../localArtistsDB.json";
import { removeDuplicates, ToSlugArtist } from "./utilities";
import { parseData } from "./getEvents";
import { authenticatedFetch } from "./authenticatedFetch";
import { Event, Artist } from "@/types";

interface ArtistWithSlug extends Artist {
  slug: string;
}

interface ArtistCount {
  id: number | string;
  name: string;
  count: number;
  locations: number;
}

interface ArtistEventVenue {
  location?: string;
  [key: string]: any;
}

interface ArtistEvent {
  artistList?: Artist[];
  venue: ArtistEventVenue;
  [key: string]: any;
}

// Removes Duplicate items from an array (used by getUniqueArtists)
const dedupeObjArray = (array: Artist[]): Artist[] => {
  const unique = array.reduce((accumulator: Artist[], current) => {
    if (!accumulator.find((item) => item.id === current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return unique;
};

/**
 * Returns all unique artists in all events array
 *
 * This can be used for SearchAutocomple Component
 * @returns Array
 */

export const getUniqueArtists = (array: Artist[]): ArtistWithSlug[] => {
  const allArtists: ArtistWithSlug[] = [];

  array.map((artist) => {
    const { id, name } = artist;
    const slug = ToSlugArtist(name);

    allArtists.push({
      ...artist,
      id: id!,
      name,
      slug,
    });
  });

  // TODO:  probably dont need this anymore, array is already unique but double check
  const cleanArtists = dedupeObjArray(allArtists) as ArtistWithSlug[];

  return cleanArtists;
};

// all the unique artists from static data
export const allArtists = getUniqueArtists(artistDB as Artist[]);

/**
 * This algo counts the number of times an artists appears in the data
 * and returns a sorted array with the artist name, id, counts
 *
 * Todo:
 * - need to loop only cities? because artists appear again on State events? maybe not
 * @returns Array
 */

export const getArtistsCounts = (array: ArtistEvent[]): ArtistCount[] => {
  const allArtists: Artist[] = []; // with duplicates
  const finalArtists: ArtistCount[] = []; // duplicates removed
  const artistCount: Record<string, number> = {}; // keeps count for each artists show
  const locationCount: Record<string, string[]> = {}; // keeps count for each city of artists

  // loop through array
  for (const event of array) {
    const { artistList, venue } = event;
    const { location } = venue;
    // loop through artists
    if (artistList) {
      for (const artist of artistList) {
        const { id, name } = artist;
        // add artist to array
        allArtists.push({ id, name });

        const artistIdStr = String(id);

        // add counts to artistCount
        if (!artistCount[artistIdStr]) {
          // if don't have in object start the count at 1
          artistCount[artistIdStr] = 1;
        } else {
          // otherwise increment the counter
          artistCount[artistIdStr]++;
        }

        // add city counts to locationCount
        if (!locationCount[artistIdStr]) {
          // if don't have in object, make array and add location
          locationCount[artistIdStr] = location ? [location] : [];
        } else {
          // otherwise push location to array
          if (location) {
            locationCount[artistIdStr] = [
              ...locationCount[artistIdStr],
              location,
            ];
          }
        }
      }
    }
  }

  // remove duplicates from AllArtists
  const cleanArtists = dedupeObjArray(allArtists);

  // loop through artistCount object
  for (const artistId in artistCount) {
    if (artistCount.hasOwnProperty(artistId)) {
      const count = artistCount[artistId];
      const locations = removeDuplicates(locationCount[artistId]).length;
      const artist = cleanArtists.find((a) => String(a.id) === artistId);

      if (artist && artist.id !== undefined) {
        finalArtists.push({
          id: artist.id,
          name: artist.name,
          count: count,
          locations: locations,
        });
      }
    }
  }

  // sort by the nighest number of count
  finalArtists.sort((a, b) => b.count - a.count);

  return finalArtists;
};

/**
 * *
 * functions to create unique artists pages
 */

// get data for each artist
export const getArtistData = async (slug: string): Promise<any> => {
  let data: any;
  (artistDB as Artist[]).map((artist) => {
    const { name } = artist;
    if (slug === ToSlugArtist(name)) data = artist;
  });

  return {
    slug,
    ...data,
  };
};

// Determine URL to use based on env
const setURL = (id: string | number): string => {
  let url: string;

  if (process.env.NODE_ENV === "development") {
    url = `http://localhost:3000/api/artists/${id}`;
  } else {
    url = `https://www.grooverooster.com/api/artists/${id}`;
  }

  return url;
};

// get events for each artist
export const getArtistEvents = async (
  id: string | number
): Promise<Event[]> => {
  try {
    // Check if we're running on the server-side
    const isServerSide = typeof window === "undefined";

    if (isServerSide) {
      // Server-side: Use authenticated fetch
      const apiUrl = `/api/artists/${id}`;
      const json = await authenticatedFetch<{ data: any[] }>(apiUrl);
      const data = parseData(json.data);
      return data;
    } else {
      // Client-side: Use regular fetch with full URL
      const url = setURL(id);
      const response = await fetch(url, { mode: "no-cors" });
      if (response.ok) {
        const json = await response.json();
        const data = parseData(json.data);
        return data;
      } else {
        throw new Error(response.statusText);
      }
    }
  } catch (error) {
    console.error("Error fetching artist events:", error);
    return [];
  }
};

// get LastFM data for artist
export const getArtistLastFM = async (name: string): Promise<any | null> => {
  try {
    // Check if we're running on the server-side
    const isServerSide = typeof window === "undefined";

    if (isServerSide) {
      // Server-side: Use authenticated fetch
      const apiUrl = `/api/lastfm/artistgetinfo/${name}`;
      const data = await authenticatedFetch(apiUrl);
      return data;
    } else {
      // Client-side: Use regular fetch with full URL
      const url =
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/api/lastfm/artistgetinfo/${name}`
          : `https://www.grooverooster.com/api/lastfm/artistgetinfo/${name}`;

      const response = await fetch(url, { mode: "no-cors" });
      if (!response.ok) return null;

      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching LastFM data:", error);
    return null;
  }
};
