import { useCallback } from "react";
import { clearSearch } from "../../utils/searchFilter";
import { Event } from "@/types";
import FilterStatusBar from "./FilterStatusBar";

interface FilterProps {
  events: Event[];
  setEvents: (events: Event[]) => void;
  searchTerm: string;
  filterVisible: boolean;
  setFilterVisible: (visible: boolean) => void;
  onClearFilter?: () => void;
}

/**
 * Filter component that displays an accessible filter status bar
 * instead of toast notifications.
 * Based on Primer accessibility guidelines: https://primer.style/accessibility/toasts/
 */
const Filter = ({
  events,
  setEvents,
  searchTerm,
  filterVisible,
  setFilterVisible,
  onClearFilter,
}: FilterProps) => {
  /**
   * Handles clearing the filter and updating events
   */
  const handleClearFilter = useCallback(() => {
    const newEvents = clearSearch(events);
    setEvents(newEvents);

    // Use custom clear handler if provided (for pagination persistence)
    if (onClearFilter) {
      onClearFilter();
    } else {
      // Fallback to original behavior
      setFilterVisible(false);
      // Scroll to top when clearing filter to show paginated results from the beginning
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [events, setEvents, onClearFilter, setFilterVisible]);

  // Only show the status bar if filter is visible and we have events
  if (!filterVisible || !searchTerm || !events || events.length === 0) {
    return null;
  }

  const resultCount = events.filter(
    (event) => event.isVisible !== false
  ).length;

  return (
    <FilterStatusBar
      searchTerm={searchTerm}
      resultCount={resultCount}
      onClear={handleClearFilter}
    />
  );
};

export default Filter;
