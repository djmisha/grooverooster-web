import { cleanString } from "@/utils/utilities";
import { parse, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Event, EventId, SearchTerm } from "@/types";

/**
 * Filters events based on a search term, supporting text search, single date, and date range filters
 * @param searchTerm - The search term or filter string (can be "date:YYYY-MM-DD", "daterange:YYYY-MM-DD:YYYY-MM-DD", or regular text)
 * @param events - Array of event objects to filter
 * @returns Filtered array of events with isVisible property set accordingly
 */
export const searchFilter = (
  searchTerm: SearchTerm,
  events: Event[]
): Event[] | undefined => {
  const results: EventId[] = [];

  // Extract the actual filter term if it contains a pipe separator (display|filter format)
  let actualSearchTerm = searchTerm;
  if (searchTerm.includes("|")) {
    const parts = searchTerm.split("|");
    actualSearchTerm = parts[1]; // Use the second part for actual filtering
  }

  // Check if this is a date-based filter
  if (actualSearchTerm.startsWith("date:")) {
    // Single date filter: "date:YYYY-MM-DD"
    const dateStr = actualSearchTerm.substring(5);
    const targetDate = startOfDay(parse(dateStr, "yyyy-MM-dd", new Date()));

    events.forEach((article) => {
      const { id, date } = article;
      if (date) {
        try {
          const eventDate = parse(date, "yyyy-MM-dd", new Date());
          if (startOfDay(eventDate).getTime() === targetDate.getTime()) {
            results.push(id);
          }
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }
    });
  } else if (actualSearchTerm.startsWith("daterange:")) {
    // Date range filter: "daterange:YYYY-MM-DD:YYYY-MM-DD"
    const parts = actualSearchTerm.substring(10).split(":");
    if (parts.length === 2) {
      const fromDate = startOfDay(parse(parts[0], "yyyy-MM-dd", new Date()));
      const toDate = endOfDay(parse(parts[1], "yyyy-MM-dd", new Date()));

      events.forEach((article) => {
        const { id, date } = article;
        if (date) {
          try {
            const eventDate = parse(date, "yyyy-MM-dd", new Date());
            if (isWithinInterval(eventDate, { start: fromDate, end: toDate })) {
              results.push(id);
            }
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        }
      });
    }
  } else {
    // Original string-based search
    const regexString = new RegExp(cleanString(actualSearchTerm), "i"); // used to be 'gi' but was not searching date correctly

    events.forEach((article) => {
      const { id, formattedDate, venue, artistlist, name, genres } = article;
      // Support both old and new field names
      const artistList = artistlist || article.artistList || [];
      const { name: venueName } = venue;

      if (formattedDate && regexString.test(cleanString(formattedDate))) {
        results.push(id);
      }

      if (regexString.test(cleanString(venueName))) {
        results.push(id);
      }

      if (name && regexString.test(cleanString(name))) {
        results.push(id);
      }

      artistList.forEach((artist) => {
        const { name: artistName } = artist;

        if (regexString.test(cleanString(artistName))) {
          results.push(id);
        }
      });

      // Add genre filtering
      if (genres && Array.isArray(genres)) {
        genres.forEach((genre) => {
          if (genre.name && regexString.test(cleanString(genre.name))) {
            results.push(id);
          }
        });
      }
    });
  }

  if (results.length) return showMatchedEvents(results, events);
  return undefined;
};

/**
 * Updates the visibility of events based on matched results
 * @param results - Array of event IDs that match the search criteria
 * @param events - Array of event objects to update
 * @returns Updated array of events with isVisible property set
 */
const showMatchedEvents = (results: EventId[], events: Event[]): Event[] => {
  events.forEach((event) => {
    event.isVisible = false;
    results.forEach((result) => {
      if (result === event.id) {
        event.isVisible = true;
      }
    });
  });

  return events;
};

/**
 * Clears search filter by making all events visible
 * @param events - Array of event objects to update
 * @returns Updated array of events with all isVisible properties set to true
 */
export const clearSearch = (events: Event[]): Event[] => {
  events.forEach((event) => {
    if (!event.isVisible) event.isVisible = true;
  });

  return events;
};
