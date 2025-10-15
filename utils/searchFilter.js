import { cleanString } from "./utilities";
import { parse, isWithinInterval, startOfDay, endOfDay } from "date-fns";

export const searchFilter = (searchTerm, events) => {
  let results = [];
  
  // Check if this is a date-based filter
  if (searchTerm.startsWith("date:")) {
    // Single date filter: "date:YYYY-MM-DD"
    const dateStr = searchTerm.substring(5);
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
  } else if (searchTerm.startsWith("daterange:")) {
    // Date range filter: "daterange:YYYY-MM-DD:YYYY-MM-DD"
    const parts = searchTerm.substring(10).split(":");
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
    const regexString = new RegExp(cleanString(searchTerm), "i"); // used to be 'gi' but was not searching date correctly

    events.forEach((article) => {
      const { id, formattedDate, venue, artistList, name } = article;
      const { name: venueName } = venue;

      if (regexString.test(cleanString(formattedDate))) {
        results.push(id);
      }

      if (regexString.test(cleanString(venueName))) {
        results.push(id);
      }

      if (name && regexString.test(cleanString(name))) {
        results.push(id);
      }

      artistList.forEach((artist) => {
        const { name } = artist;

        if (regexString.test(cleanString(name))) {
          results.push(id);
        }
      });
    });
  }

  if (results.length) return showMatchedEvents(results, events);
};

const showMatchedEvents = (results, events) => {
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

export const clearSearch = (events) => {
  events.forEach((event) => {
    if (!event.isVisible) event.isVisible = true;
  });

  return events;
};
