import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, startOfDay, endOfDay } from "date-fns";
import { Event } from "@/types";
import { DateRange } from "react-day-picker";

interface DatePickerFilterProps {
  events: Event[];
  setSearchTerm: (term: string) => void;
  onClose: () => void;
}

const DatePickerFilter = ({
  events,
  setSearchTerm,
  onClose,
}: DatePickerFilterProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Get dates that have events for visual feedback
  const eventDates = useMemo(() => {
    const dates = new Set();
    events.forEach((event) => {
      if (event.date) {
        try {
          const eventDate = parse(event.date, "yyyy-MM-dd", new Date());
          dates.add(startOfDay(eventDate).getTime());
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }
    });
    return dates;
  }, [events]);

  // Handle date range selection (works for both single date and range)
  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Apply date filter
  const handleApply = () => {
    if (!dateRange?.from) {
      return;
    }

    // Check if it's a single date or a range
    if (dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
      // Date range selected
      const fromDate = startOfDay(dateRange.from);
      const toDate = endOfDay(dateRange.to);

      const fromStr = format(fromDate, "MMM d");
      const toStr = format(toDate, "MMM d");

      // Set search term with formatted display
      setSearchTerm(
        `Date range: ${fromStr} through ${toStr}|daterange:${format(fromDate, "yyyy-MM-dd")}:${format(toDate, "yyyy-MM-dd")}`
      );
    } else {
      // Single date selected
      const targetDate = startOfDay(dateRange.from);
      const dateStr = format(targetDate, "MMM d");

      // Set search term with formatted display
      setSearchTerm(
        `Date: ${dateStr}|date:${format(targetDate, "yyyy-MM-dd")}`
      );
    }

    onClose();
  };

  // Clear/Reset filter
  const handleClear = () => {
    setDateRange(undefined);
    // Don't close the popover - user can continue selecting dates
  };

  // Custom day renderer to add dots for dates with events
  const modifiers = {
    hasEvent: (date: Date) => eventDates.has(startOfDay(date).getTime()),
  };

  const modifiersClassNames = {
    hasEvent: "has-event-dot",
  };

  return (
    <div className="p-4 pt-6 max-h-[80vh] overflow-y-auto">
      <h2 className="m-0 mb-4 text-xl font-normal text-blue">Filter by Date</h2>

      {/* Calendar - works for both single date and range */}
      <div className="flex justify-center mb-4">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleRangeSelect}
          numberOfMonths={1}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 rounded-md text-sm font-medium bg-pink text-white hover:bg-pink/90 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DatePickerFilter;
