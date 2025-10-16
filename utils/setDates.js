import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

/**
 * Formats a date into various display formats using dayjs
 * @param {string|Date} date - The date to format (ISO string or Date object)
 * @returns {Object} Object containing formatted date strings in different formats
 * @returns {string} returns.dayOfWeek - Full day name (e.g., "Monday")
 * @returns {string} returns.dayMonth - Abbreviated month and day (e.g., "Jan 15")
 * @returns {Date} returns.daySchema - Date object for schema markup
 * @returns {string} returns.dayMonthYear - Full format (e.g., "Monday, January 15")
 * @returns {string} returns.fromNow - Relative time from now (e.g., "2 days ago")
 */
const setDates = (date) => {
  const dayOfWeek = dayjs(date).format("dddd");
  const dayMonth = dayjs(date).format("MMM D");
  const daySchema = new Date(date);
  const dayMonthYear = dayjs(date).format("dddd, MMMM D");
  const fromNow = dayjs(date).fromNow();

  return {
    dayOfWeek,
    dayMonth,
    daySchema,
    dayMonthYear,
    fromNow,
  };
};

export default setDates;
