import React from "react";
import Artists from "@/components/Artists/Artists";
import ArtistImage from "@/components/Artists/ArtistImage";
import setDates from "@/utils/setDates";
import Modal from "@/components/Modal/Modal";
import EventDetails from "@/components/EventDetails/EventDetails";
import EventStructuredData from "@/components/SEO/EventStructuredData";
import EventPills from "@/components/EventPills/EventPills";
import { useEventModal } from "@/hooks/useEventModal";
import { FaRegCalendar, FaRegBuilding, FaUsers, FaVideo } from "react-icons/fa";
import { Event } from "@/types";
import { getFirstArtistImageId } from "@/utils/artistImageLookup";

interface EventCardProps {
  event: Event;
  openEventId: string | number | null;
  setOpenEventId: (id: string | number | null) => void;
  locationSlug?: string;
  allEvents?: Event[];
}

/**
 * EventCard component displays a single event with artist, date, venue information and modal functionality
 */
export const EventCard = ({
  event,
  openEventId,
  setOpenEventId,
  locationSlug,
  allEvents,
}: EventCardProps) => {
  const {
    date,
    artistlist,
    name,
    venue,
    isVisible,
    source,
    festivalind,
    livestreamind,
    image,
  } = event;
  // Support both old and new field names during transition
  const artistList = artistlist || event.artistList || [];
  const eventSource = source || event.eventSource;
  const festivalInd =
    festivalind !== undefined ? festivalind : event.festivalInd;
  const livestreamInd =
    livestreamind !== undefined ? livestreamind : event.livestreamInd;
  const { name: venueName } = venue;
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);

  // Use the custom hook for modal management
  const { isModalOpen, openModal, closeModal } = useEventModal(
    event.id,
    openEventId,
    setOpenEventId,
    locationSlug
  );

  /**
   * Opens the event detail modal
   */
  const handleModalOpen = () => {
    openModal();
  };

  /**
   * Closes the event detail modal
   */
  const handleModalClose = () => {
    closeModal();
  };

  /**
   * Handles keyboard interaction for opening the modal
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleModalOpen();
    }
  };

  /**
   * Checks if event name matches the first artist name exactly
   * @returns {boolean} True if event name should be hidden
   */
  const shouldHideEventName = (): boolean => {
    if (!name || artistList.length === 0) return false;
    const firstArtistName = artistList[0]?.name;
    if (!firstArtistName || typeof firstArtistName !== "string") return false;
    return name.trim().toLowerCase() === firstArtistName.trim().toLowerCase();
  };

  const truncatedArtistList =
    artistList.length > 2
      ? ([
          ...artistList.slice(0, 2),
          {
            name: (
              <span className="text-gray-400 dark:text-gray-400 text-xs font-normal inline">
                + {artistList.length - 2} more artists
              </span>
            ),
          },
        ] as any[])
      : artistList;

  /**
   * Renders the artist image with fallback background
   * @returns {JSX.Element} Artist image wrapper component
   */
  const ArtistImageWrapper = () => {
    // Try to get the EDMTrain ID for the first artist
    // This handles both old API (numeric IDs) and new API (UUID strings with name lookup)
    const numericArtistId = getFirstArtistImageId(artistList);

    return (
      <div className="w-40 h-40 flex-shrink-0 bg-no-repeat bg-cover">
        <ArtistImage id={numericArtistId} image={image} />
      </div>
    );
  };

  return (
    <>
      <EventStructuredData
        event={event}
        currentUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
      <div
        className={`relative transition-all duration-100 ease-out text-left mx-3 mb-6 md:m-0 bg-white dark:bg-gray-800 top-0 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] transform-none rounded-lg h-auto ${
          !isVisible ? "hidden" : ""
        } ${
          eventSource === "ticketmaster" ? "border-2 border-pink-500" : ""
        } md:hover:-translate-y-0.5 md:hover:scale-[1.005] md:hover:shadow-lg dark:md:hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)]`}
        itemScope
        itemType="http://schema.org/Event"
        onClick={handleModalOpen}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${artistList.map((a) => a.name).join(", ")} at ${venueName} on ${dayMonth}`}
      >
        {/* Top Section - Image and Event Info */}
        <div className="flex p-0">
          <ArtistImageWrapper />
          <div className="flex-1 p-2 pr-4 pl-4 flex flex-col justify-center gap-2">
            {name && !shouldHideEventName() && (
              <span
                className="text-gray-400 dark:text-gray-400 block text-sm font-medium leading-tight"
                itemProp="name"
              >
                {name}
              </span>
            )}

            <div
              className="break-anywhere font-semibold text-xl leading-tight text-left"
              itemProp="name"
            >
              <Artists data={truncatedArtistList} />
            </div>

            <div className="flex gap-2">
              {festivalInd && (
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-400 text-xs font-medium">
                  <FaUsers className="text-current text-xs" />
                  <span>Festival</span>
                </div>
              )}

              {livestreamInd && (
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-400 text-xs font-medium">
                  <FaVideo className="text-current text-xs" />
                  <span>Stream</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Bottom Section - Date, Venue, Tags */}
        <div className="px-4 py-4 flex flex-col gap-3">
          <div
            className="text-sm leading-7 font-medium flex items-center gap-2 text-gray-600 dark:text-gray-400"
            itemProp="startDate"
            content={daySchema}
          >
            <FaRegCalendar className="text-blue flex-shrink-0" />
            <div>
              {dayOfWeek}, {dayMonth}
            </div>
          </div>

          <div
            className="flex items-center gap-2 text-sm leading-4 text-gray-600 dark:text-gray-400 font-medium"
            itemProp="location"
            itemScope
            itemType="http://schema.org/Place"
          >
            <FaRegBuilding className="text-blue flex-shrink-0" />
            <span itemProp="name">{venueName}</span>
          </div>

          <div className="mt-2">
            <EventPills event={event} />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          component={() => <EventDetails event={event} allEvents={allEvents} />}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default EventCard;
