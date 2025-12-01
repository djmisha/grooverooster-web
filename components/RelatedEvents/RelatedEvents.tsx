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
 * Shows events at the same venue or on the same date
 * Prioritizes venue matches over date matches
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
   * Gets related events based on same venue or same date
   * Prioritizes venue matches, then date matches
   * Excludes the current event and limits to 6 results
   */
  const getRelatedEvents = useCallback((): Event[] => {
    if (!allEvents || allEvents.length === 0) return [];

    const current = getEventData(currentEvent);

    // Find events at the same venue (highest priority)
    const sameVenueEvents = allEvents.filter((event) => {
      const eventData = getEventData(event);
      return (
        eventData.id !== current.id && eventData.venueName === current.venueName
      );
    });

    // Find events on the same date (excluding venue matches)
    const sameDateEvents = allEvents.filter((event) => {
      const eventData = getEventData(event);
      return (
        eventData.id !== current.id &&
        eventData.date === current.date &&
        eventData.venueName !== current.venueName
      );
    });

    // Combine and limit to 6
    const relatedEvents = [...sameVenueEvents, ...sameDateEvents].slice(0, 6);

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
