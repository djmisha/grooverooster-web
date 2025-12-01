"use client";

import React, { useRef, useState, useEffect } from "react";
import { Event } from "@/types";
import RelatedEventCard from "./RelatedEventCard";
import Modal from "@/components/Modal/Modal";
import EventDetails from "@/components/EventDetails/EventDetails";

interface RelatedEventsProps {
  currentEvent: Event;
  allEvents: Event[];
}

/**
 * RelatedEvents component displays a horizontal carousel of related events
 * Shows events at the same venue or on the same date
 * Prioritizes venue matches over date matches
 * Limited to 6 events maximum
 */
const RelatedEvents = ({ currentEvent, allEvents }: RelatedEventsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  /**
   * Gets related events based on same venue or same date
   * Prioritizes venue matches, then date matches
   * Excludes the current event and limits to 6 results
   */
  const getRelatedEvents = (): Event[] => {
    if (!allEvents || allEvents.length === 0) return [];

    const currentEventId = String(currentEvent.id);
    const currentVenueName = currentEvent.venue?.name?.toLowerCase() || "";
    const currentDate = currentEvent.date?.split("T")[0] || "";

    // Find events at the same venue (highest priority)
    const sameVenueEvents = allEvents.filter((event) => {
      const eventId = String(event.id);
      const venueName = event.venue?.name?.toLowerCase() || "";
      return eventId !== currentEventId && venueName === currentVenueName;
    });

    // Find events on the same date
    const sameDateEvents = allEvents.filter((event) => {
      const eventId = String(event.id);
      const eventDate = event.date?.split("T")[0] || "";
      const venueName = event.venue?.name?.toLowerCase() || "";
      // Exclude current event and already included venue matches
      return (
        eventId !== currentEventId &&
        eventDate === currentDate &&
        venueName !== currentVenueName
      );
    });

    // Combine and limit to 6
    const relatedEvents = [...sameVenueEvents, ...sameDateEvents].slice(0, 6);

    return relatedEvents;
  };

  const relatedEvents = getRelatedEvents();

  // Mouse drag handlers for smooth scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile swipe
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchScrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].pageX - container.offsetLeft;
      touchScrollLeft = container.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - touchStartX) * 2;
      container.scrollLeft = touchScrollLeft - walk;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  /**
   * Handles clicking on a related event card
   */
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  /**
   * Closes the modal
   */
  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  // Don't render if no related events
  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 px-4">
        Related Events
      </h3>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing snap-x snap-mandatory md:snap-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {relatedEvents.map((event) => (
          <div key={event.id} className="snap-start md:snap-align-none">
            <RelatedEventCard
              event={event}
              onClick={() => handleEventClick(event)}
            />
          </div>
        ))}
      </div>

      {/* Modal for viewing event details */}
      {selectedEvent && (
        <Modal
          component={() => <EventDetails event={selectedEvent} />}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default RelatedEvents;
