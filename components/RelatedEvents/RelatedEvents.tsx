"use client";

import React, { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
 * Shows events on the same date or at the same venue
 * Prioritizes date matches over venue matches
 * Limited to 6 events maximum
 * Uses Embla Carousel for smooth mobile scrolling
 */
const RelatedEvents = ({ currentEvent, allEvents }: RelatedEventsProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Embla Carousel setup with smooth scrolling options
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: false,
  });

  /**
   * Extracts normalized event data for comparison
   */
  const getEventData = useCallback(
    (event: Event) => ({
      id: String(event.id),
      venueName: event.venue?.name?.toLowerCase() || "",
      date: event.date?.split("T")[0] || "",
    }),
    []
  );

  /**
   * Gets related events based on same date or same venue
   * Prioritizes date matches, then venue matches
   * Excludes the current event and limits to 6 results
   */
  const getRelatedEvents = useCallback((): Event[] => {
    if (!allEvents || allEvents.length === 0) return [];

    const current = getEventData(currentEvent);

    // Find events on the same date (highest priority)
    const sameDateEvents = allEvents.filter((event) => {
      const eventData = getEventData(event);
      return eventData.id !== current.id && eventData.date === current.date;
    });

    // Find events at the same venue (excluding date matches)
    const sameVenueEvents = allEvents.filter((event) => {
      const eventData = getEventData(event);
      return (
        eventData.id !== current.id &&
        eventData.venueName === current.venueName &&
        eventData.date !== current.date
      );
    });

    // Combine and limit to 6 (date first, then venue)
    const relatedEvents = [...sameDateEvents, ...sameVenueEvents].slice(0, 6);

    return relatedEvents;
  }, [allEvents, currentEvent, getEventData]);

  const relatedEvents = getRelatedEvents();

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
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 pb-8">
      <h3 className="text-lg font-normal text-pink dark:text-pink-400 mb-4 px-4">
        Related Events
      </h3>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pl-4">
          {relatedEvents.map((event) => (
            <div key={event.id} className="flex-shrink-0">
              <RelatedEventCard
                event={event}
                onClick={() => handleEventClick(event)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal for viewing event details */}
      {selectedEvent && (
        <Modal
          component={() => (
            <EventDetails event={selectedEvent} allEvents={allEvents} />
          )}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default RelatedEvents;
