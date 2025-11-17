import { Event, Artist, FilterItemWithCount } from "@/types";

/* Remove Duplicates Helper */

export const removeDuplicates = <T>(array: T[]): T[] => {
  return array.filter((a, b) => array.indexOf(a) === b);
};

/**
 * Removes &amp; from string and
 * special characters except letters and numbers
 * @param string - String to clean
 * @returns clean string
 */
export const cleanString = (string: string): string => {
  const cleanedString = string
    .replace(/&amp;/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "");
  return cleanedString;
};

/**
 * Functions to create event arrays of strings
 */
export const makeVenues = (data: Event[]): string[] => {
  return removeDuplicates(data.map((item) => item.venue.name)).sort();
};

export const makeDates = (data: Event[]): string[] => {
  const dateMapping: Record<string, string> = {}; // Map original date to formatted date

  data.forEach((item) => {
    if (item.formattedDate && item.date) {
      dateMapping[item.date] = item.formattedDate;
    }
  });

  // Sort by original date (chronological order) but return formatted dates
  return Object.keys(dateMapping)
    .sort()
    .map((originalDate) => dateMapping[originalDate]);
};

export const makeArtists = (data: Event[]): string[] => {
  let allArtists: string[] = [];
  data.map((item) => {
    // Support both old and new field names
    const artistList = item.artistlist || item.artistList || [];
    return artistList.map((artist) => {
      allArtists.push(artist.name);
    });
  });
  allArtists = removeDuplicates(allArtists);

  return allArtists;
};

export const makeGenres = (data: Event[]): string[] => {
  let allGenres: string[] = [];
  data.forEach((item) => {
    if (item.genres && Array.isArray(item.genres)) {
      item.genres.forEach((genre) => {
        if (genre.name) {
          allGenres.push(genre.name);
        }
      });
    }
  });
  allGenres = removeDuplicates(allGenres);

  return allGenres.sort();
};

export const cityOrState = (
  city: string | undefined,
  state: string
): string => {
  const string = city ? `${city}, ${state}` : `${state}`;
  return string;
};

export const makePageTitle = (
  city: string | undefined,
  state: string
): string => {
  return `Dance Music Events in ${cityOrState(
    city,
    state
  )} - Nightclub DJ & Concerts`;
};

export const makePageHeadline = (
  city: string | undefined,
  state: string
): string => {
  return `Music Events in ${cityOrState(city, state)}`;
};

export const makePageDescription = (
  city: string | undefined,
  state: string
): string => {
  const title = `Find electronic dance music events in  ${cityOrState(
    city,
    state
  )}! From nightclub DJ's to EDM concerts - experience live music at raves, parties and clubs near you.`;
  return title;
};

export const urlBigData = (lat: number, long: number): string => {
  return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
};

/**
 * Randomize Array Utility
 */
export const shuffleArray = <T>(array: T[] | undefined): T[] | undefined => {
  if (!array) return;
  const newArray = array;
  let currentIndex = array?.length;
  let temporaryValue: T;
  let randomIndex: number;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return newArray;
};

export const ToSlugArtist = (string: string | undefined): string => {
  if (!string) return "undefined";

  const cleanedString = string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks but keep base letters
    .replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "-") // Keep letters including accented ones
    .replace(/ /g, "-")
    .split("&")
    .join("&amp;")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleanedString;
};

/**
 * Removes artists with the name "Surprise Guest", "TBD", or "Special Guest" from an array.
 * @param artists - Array of artists to filter
 * @returns Filtered array of artists
 */
export function filterSurpriseGuest(artists: Artist[]): Artist[] {
  return artists.filter((artist) => {
    const name = artist.name?.toLowerCase();
    return (
      name !== "tbd" &&
      name !== "tba" &&
      name !== "surprise guest" &&
      name !== "special guest"
    );
  });
}

export const makeSeries = (data: Event[]): string[] => {
  // Count occurrences of each event name
  const eventNameCounts: Record<string, number> = {};
  data.forEach((item) => {
    if (item.name) {
      eventNameCounts[item.name] = (eventNameCounts[item.name] || 0) + 1;
    }
  });

  // Filter to only include event names with more than 2 events
  const series = Object.keys(eventNameCounts).filter(
    (eventName) => eventNameCounts[eventName] > 1
  );

  // Alphabetize the list and remove duplicates
  return removeDuplicates(series).sort();
};

export const makeVenuesWithCounts = (data: Event[]): FilterItemWithCount[] => {
  const venueCounts: Record<string, number> = {};
  data.forEach((item) => {
    if (item.venue && item.venue.name) {
      venueCounts[item.venue.name] = (venueCounts[item.venue.name] || 0) + 1;
    }
  });

  return Object.keys(venueCounts)
    .sort()
    .map((venue) => ({
      name: venue,
      count: venueCounts[venue],
    }));
};

export const makeDatesWithCounts = (data: Event[]): FilterItemWithCount[] => {
  const dateCounts: Record<string, number> = {};
  const dateMapping: Record<string, string> = {}; // Map original date to formatted date

  data.forEach((item) => {
    if (item.formattedDate && item.date) {
      dateCounts[item.formattedDate] =
        (dateCounts[item.formattedDate] || 0) + 1;
      dateMapping[item.date] = item.formattedDate;
    }
  });

  // Sort by original date (chronological order) but display formatted date
  return Object.keys(dateMapping)
    .sort()
    .map((originalDate) => {
      const formattedDate = dateMapping[originalDate];
      return {
        name: formattedDate, // Display the formatted date
        originalDate: formattedDate, // Use formatted date for filtering
        count: dateCounts[formattedDate],
      };
    });
};

export const makeSeriesWithCounts = (data: Event[]): FilterItemWithCount[] => {
  const eventNameCounts: Record<string, number> = {};
  data.forEach((item) => {
    if (item.name) {
      eventNameCounts[item.name] = (eventNameCounts[item.name] || 0) + 1;
    }
  });

  // Filter to only include event names with more than 1 event
  return Object.keys(eventNameCounts)
    .filter((eventName) => eventNameCounts[eventName] > 1)
    .sort()
    .map((seriesItem) => ({
      name: seriesItem,
      count: eventNameCounts[seriesItem],
    }));
};

export const makeGenresWithCounts = (data: Event[]): FilterItemWithCount[] => {
  const genreCounts: Record<string, number> = {};
  data.forEach((item) => {
    if (item.genres && Array.isArray(item.genres)) {
      item.genres.forEach((genre) => {
        if (genre.name) {
          genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
        }
      });
    }
  });

  return Object.keys(genreCounts)
    .sort()
    .map((genre) => ({
      name: genre,
      count: genreCounts[genre],
    }));
};

export const makeArtistsWithCounts = (data: Event[]): FilterItemWithCount[] => {
  const artistCounts: Record<string, number> = {};
  data.forEach((item) => {
    // Support both old and new field names
    const artistList = item.artistlist || item.artistList || [];
    artistList.forEach((artist) => {
      if (artist.name) {
        artistCounts[artist.name] = (artistCounts[artist.name] || 0) + 1;
      }
    });
  });

  return Object.keys(artistCounts)
    .sort()
    .map((artist) => ({
      name: artist,
      count: artistCounts[artist],
    }));
};
