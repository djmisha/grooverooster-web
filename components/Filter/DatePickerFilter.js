import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

const DatePickerFilter = ({ events, setSearchTerm, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [dateRange, setDateRange] = useState(undefined);
  const [isRangeMode, setIsRangeMode] = useState(false);

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
      toast.error("Please select a date or date range");
      return;
    }

    let filteredCount = 0;
    
    if (isRangeMode && dateRange?.from) {
      // Filter by date range
      const fromDate = startOfDay(dateRange.from);
      const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      
      events.forEach((event) => {
        if (event.date) {
          try {
            const eventDate = parse(event.date, "yyyy-MM-dd", new Date());
            const isInRange = isWithinInterval(eventDate, { start: fromDate, end: toDate });
            if (isInRange) {
              filteredCount++;
            }
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        }
      });

      const fromStr = format(fromDate, "MMM d, yyyy");
      const toStr = format(toDate, "MMM d, yyyy");
      
      if (filteredCount > 0) {
        toast.success(`Showing ${filteredCount} event${filteredCount !== 1 ? 's' : ''} from ${fromStr} to ${toStr}`);
        // Set search term to trigger filter
        setSearchTerm(`daterange:${format(fromDate, "yyyy-MM-dd")}:${format(toDate, "yyyy-MM-dd")}`);
      } else {
        toast.error(`No events found from ${fromStr} to ${toStr}`);
      }
    } else if (selectedDate) {
      // Filter by single date
      const targetDate = startOfDay(selectedDate);
      
      events.forEach((event) => {
        if (event.date) {
          try {
            const eventDate = parse(event.date, "yyyy-MM-dd", new Date());
            if (startOfDay(eventDate).getTime() === targetDate.getTime()) {
              filteredCount++;
            }
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        }
      });

      const dateStr = format(targetDate, "MMMM d, yyyy");
      
      if (filteredCount > 0) {
        toast.success(`Showing ${filteredCount} event${filteredCount !== 1 ? 's' : ''} on ${dateStr}`);
        // Set search term to trigger filter
        setSearchTerm(`date:${format(targetDate, "yyyy-MM-dd")}`);
      } else {
        toast.error(`No events found on ${dateStr}`);
      }
    }

    if (filteredCount > 0) {
      onClose();
    }
  };

  // Clear/Reset filter
  const handleClear = () => {
    setSelectedDate(undefined);
    setDateRange(undefined);
    toast.info("Date filter cleared");
    onClose();
  };

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <h2 className="m-0 mb-4 text-xl font-semibold text-black">
        Filter by Date
      </h2>
      
      {/* Toggle between single date and range */}
      <div className="mb-4 flex gap-2">
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
          />
        ) : (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSingleDateSelect}
            className="rounded-md border"
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
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
