import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isWithinInterval, startOfDay, endOfDay } from "date-fns";

const DatePickerFilter = ({ events, setSearchTerm, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [dateRange, setDateRange] = useState(undefined);
  const [isRangeMode, setIsRangeMode] = useState(false);

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

  // Handle single date selection
  const handleSingleDateSelect = (date) => {
    setSelectedDate(date);
    setDateRange(undefined);
  };

  // Handle date range selection
  const handleRangeSelect = (range) => {
    setDateRange(range);
    setSelectedDate(undefined);
  };

  // Apply date filter
  const handleApply = () => {
    if (!selectedDate && !dateRange?.from) {
      return;
    }
    
    if (isRangeMode && dateRange?.from) {
      // Filter by date range
      const fromDate = startOfDay(dateRange.from);
      const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      
      const fromStr = format(fromDate, "MMM d");
      const toStr = format(toDate, "MMM d");
      
      // Set search term with formatted display
      setSearchTerm(`Date range: ${fromStr} through ${toStr}|daterange:${format(fromDate, "yyyy-MM-dd")}:${format(toDate, "yyyy-MM-dd")}`);
    } else if (selectedDate) {
      // Filter by single date
      const targetDate = startOfDay(selectedDate);
      const dateStr = format(targetDate, "MMM d");
      
      // Set search term with formatted display
      setSearchTerm(`Date: ${dateStr}|date:${format(targetDate, "yyyy-MM-dd")}`);
    }

    onClose();
  };

  // Clear/Reset filter
  const handleClear = () => {
    setSelectedDate(undefined);
    setDateRange(undefined);
    // Don't close the popover - user can continue selecting dates
  };

  // Custom day renderer to add dots for dates with events
  const modifiers = {
    hasEvent: (date) => eventDates.has(startOfDay(date).getTime()),
  };

  const modifiersClassNames = {
    hasEvent: "has-event-dot",
  };

  return (
    <div className="p-4 pt-6 max-h-[80vh] overflow-y-auto">
      <h2 className="m-0 mb-4 text-xl font-normal text-blue">
        Filter by Date
      </h2>
      
      {/* Toggle between single date and range */}
      <div className="mb-4 flex gap-2 justify-center">
        <button
          onClick={() => {
            setIsRangeMode(false);
            setDateRange(undefined);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            !isRangeMode
              ? "bg-pink text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Single Date
        </button>
        <button
          onClick={() => {
            setIsRangeMode(true);
            setSelectedDate(undefined);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isRangeMode
              ? "bg-pink text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Date Range
        </button>
      </div>

      {/* Calendar */}
      <div className="flex justify-center mb-4">
        {isRangeMode ? (
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleRangeSelect}
            numberOfMonths={1}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
        ) : (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSingleDateSelect}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
        )}
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
