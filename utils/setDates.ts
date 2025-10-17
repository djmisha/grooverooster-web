import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FormattedDate } from "../types";
dayjs.extend(relativeTime);

/**
 * Formats a date into various display formats using dayjs
 * @param date - The date to format (ISO string or Date object)
 * @returns Object containing formatted date strings in different formats
 */
const setDates = (
  date: string | Date
): FormattedDate & { dayMonthYear: string; fromNow: string } => {
  const dayOfWeek = dayjs(date).format("dddd");
  const dayMonth = dayjs(date).format("MMM D");
  const daySchema = dayjs(date).format();
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
