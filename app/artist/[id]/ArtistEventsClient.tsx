"use client";

import EventCard from "../../../components/EventCard/EventCard";
import { useEventModalManager } from "../../../hooks/useEventModal";

export default function ArtistEventsClient({ events }: { events: any[] }) {
  const { openEventId, setOpenEventId } = useEventModalManager();

  return (
    <div className="p-0 pb-10 transition-all duration-300 ease-out sm:px-2.5 sm:grid sm:grid-cols-2 sm:gap-4 md:mb-5 xl:grid-cols-3">
      {events?.map((event: any) => (
        <EventCard
          event={event}
          key={event.id}
          openEventId={openEventId as number | null}
          setOpenEventId={setOpenEventId as (id: number | null) => void}
        />
      ))}
    </div>
  );
}
