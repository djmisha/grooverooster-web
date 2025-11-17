import React from "react";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import EventPills from "../EventPills/EventPills";
import {
  FaRegCalendar,
  FaRegBuilding,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
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
  const { date, artistlist, name, venue, link, source, image } = event;
  // Support both old and new field names during transition
  const artistList = artistlist || event.artistList || [];
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema: _daySchema } = setDates(date);

  // Determine button text based on source
  const isEDMTrain = source === "edmtrain";
  const buttonText = isEDMTrain ? "View Details" : "Get Tickets";

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
    <div className="flex flex-col items-center text-center px-2 py-2 md:px-2 md:py-2">
      <h2
        className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl sr-only"
        id="modal-title"
      >
        Event Details: {artistList.map((a) => a.name).join(", ")} at {venueName}
      </h2>
      <div className="bg-white dark:bg-gray-700 w-52 h-52 bg-no-repeat bg-cover rounded-md mb-6 md:mb-8 mx-auto transition-colors duration-200">
        <ArtistImage
          id={getFirstArtistImageId(artistList)}
          image={image}
          large={true}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 text-blue dark:text-blue-400 text-base font-medium pb-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
          <FaRegCalendar className="text-blue dark:text-blue-400 text-lg" />
          <span className="text-base font-medium">
            {dayOfWeek}, {dayMonth}
          </span>
        </div>
        {name && (
          <div className="text-black dark:text-gray-200 text-base font-medium pt-4 transition-colors duration-200">
            {name}
          </div>
        )}
        <div className="text-pink-600 dark:text-pink-400 text-2xl font-bold pb-4 border-b border-gray-200 dark:border-gray-600 py-4 transition-colors duration-200">
          <Artists data={artistList} />
        </div>
        <div className="flex items-center gap-2 text-black dark:text-gray-200 text-base font-medium pt-6 pb-2 justify-center transition-colors duration-200">
          <FaRegBuilding className="text-gray-700 dark:text-gray-400 text-lg" />
          <span>{venueName}</span>
        </div>
        {address && (
          <a
            rel="noreferrer"
            href={`https://www.google.com/maps/search/${venueName} ${address}`}
            target="_blank"
            className="text-black dark:text-gray-200 flex items-center gap-2 justify-center no-underline hover:underline pt-2 pb-2 transition-colors duration-200"
          >
            <FaMapMarkerAlt className="text-blue-500 dark:text-blue-400 text-lg" />
            <span className="block text-sm leading-5">
              {formatAddress(address)}
            </span>
          </a>
        )}
        <EventPills event={event} centered={true} />
        <div className="mt-8 md:mt-10">
          <Button
            href={link}
            variant="primary"
            target="_blank"
            rel="noreferrer"
          >
            <span className="flex items-center gap-2">
              {buttonText}
              <FaExternalLinkAlt className="text-sm" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
