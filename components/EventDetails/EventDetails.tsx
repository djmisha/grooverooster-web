import React from "react";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import EventPills from "../EventPills/EventPills";
import {
  FaRegCalendar,
  FaRegBuilding,
  FaMapMarkerAlt,
  FaUsers,
  FaVideo,
} from "react-icons/fa";
import Button from "../Button/Button";
import { Event } from "@/types";
import { getFirstArtistImageId } from "../../utils/artistImageLookup";

interface EventDetailsProps {
  event: Event;
}

/**
 * EventDetails component displays detailed information about an event in a modal
 */
const EventDetails = ({ event }: EventDetailsProps) => {
  const {
    date,
    artistlist,
    name,
    venue,
    link,
    source: _source,
    image,
    festivalind,
    livestreamind,
  } = event;
  // Support both old and new field names during transition
  const artistList = artistlist || event.artistList || [];
  const festivalInd =
    festivalind !== undefined ? festivalind : event.festivalInd;
  const livestreamInd =
    livestreamind !== undefined ? livestreamind : event.livestreamInd;
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema: _daySchema } = setDates(date);

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

  // Format address with line breaks
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return null;

    // Split address by comma to separate street from city/state/zip
    const parts = addr.split(",").map((p) => p.trim());
    if (parts.length <= 1) return addr;

    // First part is street, rest is city/state/zip
    const street = parts[0];
    const cityStateZip = parts.slice(1).join(", ");

    return (
      <>
        {street}
        <br />
        {cityStateZip}
      </>
    );
  };

  return (
    <div className="flex flex-col text-left bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-colors duration-200">
      <h2
        className="font-normal text-lg text-blue md:inline-block md:text-xl sr-only"
        id="modal-title"
      >
        Event Details: {artistList.map((a) => a.name).join(", ")} at {venueName}
      </h2>

      {/* Top Section - Image and Event Info */}
      <div className="flex p-0">
        <div className="w-40 h-40 flex-shrink-0 bg-no-repeat bg-cover">
          <ArtistImage id={getFirstArtistImageId(artistList)} image={image} />
        </div>
        <div className="flex-1 p-2 pr-4 pl-4 flex flex-col justify-center gap-2">
          {name && !shouldHideEventName() && (
            <span className="text-gray-400 dark:text-gray-600 block text-sm font-medium">
              {name}
            </span>
          )}

          <div className="break-anywhere font-semibold text-xl leading-6 text-left">
            <Artists data={artistList} />
          </div>

          <div className="flex gap-2">
            {festivalInd && (
              <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
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
      </div>

      {/* Separator Line */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Bottom Section - Date, Venue, Address, Tags, Button */}
      <div className="px-4 py-6 flex flex-col gap-3">
        <div className="text-sm leading-7 font-medium flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <FaRegCalendar className="text-gray-600 dark:text-gray-400" />
          <div>
            {dayOfWeek}, {dayMonth}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm leading-4 text-gray-600 dark:text-gray-400 font-medium">
          <FaRegBuilding className="text-gray-600 dark:text-gray-400" />
          <span>{venueName}</span>
        </div>

        {address && (
          <a
            rel="noreferrer"
            href={`https://www.google.com/maps/search/${venueName} ${address}`}
            target="_blank"
            className="text-gray-600 dark:text-gray-400 flex items-center gap-2 no-underline hover:underline text-sm"
          >
            <FaMapMarkerAlt className="text-gray-600 dark:text-gray-400" />
            <span className="block leading-5">{formatAddress(address)}</span>
          </a>
        )}

        <div className="mt-1">
          <EventPills event={event} />
        </div>

        <div className="mt-2">
          <Button
            href={link}
            variant="primary"
            target="_blank"
            rel="noreferrer"
          >
            Get Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
