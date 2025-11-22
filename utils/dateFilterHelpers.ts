import { Event } from "@/types";

/**
 * Get today's date in user's local timezone as YYYY-MM-DD
 * @returns {string} - Today's date in YYYY-MM-DD format
 */
export const getTodayInLocalTimezone = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Filter out events that are in the past (before today in user's timezone)
 * Events happening "today" are included until midnight local time
 * @param {Event[]} events - Array of events to filter
 * @returns {Event[]} - Events from today onwards
 */
export const filterPastEventsClientSide = (events: Event[]): Event[] => {
  const todayLocal = getTodayInLocalTimezone();

  return events.filter((event) => {
    if (!event.date) return false;

    // Extract YYYY-MM-DD from event date (handles both "YYYY-MM-DD" and ISO strings)
    const eventDateString = event.date.split("T")[0];

    // Keep events that are today or in the future
    return eventDateString >= todayLocal;
  });
};
