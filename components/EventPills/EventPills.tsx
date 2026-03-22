import React from "react";
import { Event } from "@/types";

interface EventPillsProps {
  event: Event;
  centered?: boolean;
}

/**
 * EventPills component displays pills for genre, event source, and festival indicator
 * @param event - The event object containing event details
 * @param centered - Whether to center the pills (for event details popup)
 */
const EventPills = ({ event, centered = false }: EventPillsProps) => {
  const {
    primary_genre,
    genres,
    source,
    eventSource,
    festivalind,
    festivalInd,
  } = event;

  // Support both old and new field names
  const festivalIndicator =
    festivalind !== undefined ? festivalind : festivalInd;
  const sourceValue = source || eventSource;

  // Get the primary genre or first genre from the list
  const genreName = primary_genre?.name || genres?.[0]?.name;

  const containerClasses = centered
    ? "flex flex-wrap justify-center gap-2 py-4"
    : "flex flex-wrap gap-2";

  const formatSource = (src: string): string => {
    if (src.toLowerCase() === "edmtrain") {
      return "EDM Train";
    }
    if (src.toLowerCase() === "ticketmaster") {
      return "Ticketmaster";
    }
    return src;
  };

  return (
    <div className={containerClasses}>
      {genreName && (
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full transition-colors duration-200">
          {genreName}
        </span>
      )}
      {sourceValue && (
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full transition-colors duration-200">
          {formatSource(sourceValue)}
        </span>
      )}
      {festivalIndicator && (
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full transition-colors duration-200">
          Festival
        </span>
      )}
    </div>
  );
};

export default EventPills;
