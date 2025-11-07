import React from "react";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import Modal from "../Modal/Modal";
import EventDetails from "../EventDetails/EventDetails";
import EventStructuredData from "../SEO/EventStructuredData";
import EventPills from "../EventPills/EventPills";
import { useEventModal } from "../../hooks/useEventModal";
import { FaRegCalendar, FaRegBuilding, FaUsers, FaVideo } from "react-icons/fa";
import { Event } from "@/types";
import { getFirstArtistImageId } from "../../utils/artistImageLookup";

interface EventCardProps {
  event: Event;
  openEventId: string | number | null;
  setOpenEventId: (id: string | number | null) => void;
}

/**
 * EventCard component displays a single event with artist, date, venue information and modal functionality
 */
export const EventCard = ({
  event,
  openEventId,
  setOpenEventId,
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
    imageUrl,
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
    setOpenEventId
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

  const truncatedArtistList =
    artistList.length > 2
      ? ([
          ...artistList.slice(0, 2),
          {
            name: (
              <span className="text-gray-500 dark:text-gray-400 text-sm font-normal inline">
                ... {artistList.length - 2} more artists
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
      <div
        className="bg-white w-28 h-28 bg-no-repeat bg-cover rounded-md mr-5"
        style={{
          backgroundImage:
            "url('https://www.grooverooster.com/images/housemusic192.png')",
        }}
      >
        <ArtistImage id={numericArtistId} imageUrl={imageUrl} />
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
        className={`relative transition-all duration-100 ease-out text-left py-5 px-4 mx-3 mb-6 md:m-0 md:p-5 bg-white dark:bg-gray-800 top-0 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] transform-none rounded-lg h-auto ${
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
        <div className="flex">
          <ArtistImageWrapper />
          <div className="w-[calc(100%-140px)] flex flex-col justify-between gap-2.5 h-auto">
            <div>
              <div className="flex justify-between items-center w-full">
                <div
                  className="text-sm leading-7 font-medium flex items-center gap-2 m-0 p-0"
                  style={{ color: "#1c94a5" }}
                  itemProp="startDate"
                  content={daySchema}
                >
                  <FaRegCalendar className="text-current" />
                  <div>
                    {dayOfWeek}, {dayMonth}
                  </div>
                </div>
              </div>

              {name && (
                <span
                  className="text-black dark:text-gray-200 block whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%] mt-1"
                  itemProp="name"
                >
                  {name}
                </span>
              )}
              <div className="flex">
                {festivalInd && (
                  <div className="flex items-center gap-1 text-orange-500 text-xs font-medium mr-2.5">
                    <FaUsers className="text-current text-xs" />
                    <span>Festival</span>
                  </div>
                )}

                {livestreamInd && (
                  <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                    <FaVideo className="text-current text-xs" />
                    <span>Stream</span>
                  </div>
                )}
              </div>
            </div>

            <div
              className="break-anywhere font-semibold text-xl leading-6 text-left relative pb-2.5 m-0 p-0 md:pb-2.5"
              itemProp="name"
            >
              <Artists data={truncatedArtistList} />
            </div>

            <div
              className="flex items-center gap-2 text-sm leading-4 text-black dark:text-gray-200 m-0 p-0 font-medium"
              itemProp="location"
              itemScope
              itemType="http://schema.org/Place"
            >
              <FaRegBuilding className="text-current" />
              <span itemProp="name">{venueName}</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <EventPills event={event} />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          component={() => <EventDetails event={event} />}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default EventCard;
