/**
 * Formats event time for display in the UI
 * Handles both 24-hour format (19:00:00, 19:00) and 12-hour format (7:00 PM)
 */
export const formatTime = (time: string | undefined): string | null => {
  if (!time) return null;

  try {
    // Check if time already contains AM/PM
    if (/AM|PM/i.test(time)) {
      return time.trim();
    }

    // Parse 24-hour format (19:00:00 or 19:00)
    const timeStr = time.replace(/[^\d:]/g, ""); // Remove non-digit/colon chars
    const [hours, minutes] = timeStr.split(":");

    if (!hours) return null;

    const hour = parseInt(hours);
    const minute = parseInt(minutes || "0");

    if (isNaN(hour) || isNaN(minute)) return null;

    // Convert to 12-hour format
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    // Only show minutes if they're not :00
    const minuteStr = minute !== 0 ? `:${String(minute).padStart(2, "0")}` : "";

    return `${hour12}${minuteStr} ${period}`;
  } catch (error) {
    console.warn("Error formatting time:", error);
    return null;
  }
};

/**
 * Formats event time range for display
 * Examples:
 * - "9 PM - 4 AM" (different periods)
 * - "9 PM - 11 PM" (same period)
 * - "9:30 PM - 2 AM" (with minutes)
 */
export const formatTimeRange = (
  startTime: string | undefined,
  endTime: string | undefined
): string | null => {
  const start = formatTime(startTime);
  const end = formatTime(endTime);

  if (!start && !end) return null;
  if (!end) return start;
  if (!start) return end;

  return `${start} - ${end}`;
};
