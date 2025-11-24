"use client";

import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/features/AppContext";
import { getSDHMEventsClient } from "@/utils/getEvents";
import { ToSlugArtist } from "@/utils/utilities";
import EventCard from "@/components/EventCard/EventCard";
import Button from "@/components/Button/Button";
import { useEventModalManager } from "@/hooks/useEventModal";
import { Event } from "@/types";

/**
 * Locator component displays nearby events based on user's current location
 */
const Locator = () => {
  const context = useContext(AppContext);
  const { openEventId, setOpenEventId } = useEventModalManager();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (
        context?.currentUserLocation?.id &&
        context?.currentUserLocation?.city
      ) {
        setLoading(true);
        try {
          const locationId =
            typeof context.currentUserLocation.id === "string"
              ? Number(context.currentUserLocation.id)
              : context.currentUserLocation.id;
          const eventsData = await getSDHMEventsClient(
            locationId,
            context.currentUserLocation.city
          );
          setEvents(eventsData);
        } catch (error) {
          console.error("Error fetching events:", error);
          setEvents([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvents();
  }, [context?.currentUserLocation]);

  if (!context?.currentUserLocation?.id || loading) return null;
  const cityState = [
    context.currentUserLocation.city,
    context.currentUserLocation.state,
  ]
    .filter(Boolean)
    .join(", ");

  const locationSlug = ToSlugArtist(
    context.currentUserLocation.city || context.currentUserLocation.state
  );

  return (
    <div className="max-w-[1440] m-auto">
      <h2 className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl mb-4 px-4 ">
        Near You in <strong>{cityState}</strong>
      </h2>
      <div className="p-0 pb-6 transition-all duration-200 ease-out sm:px-3 sm:grid sm:grid-cols-2 sm:gap-8 md:mb-5 xl:grid-cols-3">
        {events?.slice(0, 9).map((event) => (
          <EventCard
            event={event}
            key={event.id}
            openEventId={openEventId}
            setOpenEventId={setOpenEventId}
            locationSlug={locationSlug}
          />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button href={`/events/${locationSlug}`} variant="primary">
          {`View all events in ${cityState}`}
        </Button>
      </div>
    </div>
  );
};

export default Locator;
