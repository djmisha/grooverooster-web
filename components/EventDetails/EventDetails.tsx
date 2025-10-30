import React from "react";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import { FaRegCalendar, FaRegBuilding, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../Button/Button";
import { Event } from "@/types";

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
    imageUrl,
  } = event;
  // Support both old and new field names during transition
  const artistList = artistlist || event.artistList || [];
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema: _daySchema } = setDates(date);

  return (
    <div className="flex flex-col items-center text-center px-2 py-2 md:px-2 md:py-2">
      <h2
        className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl sr-only"
        id="modal-title"
      >
        Event Details: {artistList.map((a) => a.name).join(", ")} at {venueName}
      </h2>
      <div
        className="bg-white w-28 h-28 bg-no-repeat bg-cover rounded-md mb-6 md:mb-8 mx-auto"
        style={{
          backgroundImage:
            "url('https://www.grooverooster.com/images/housemusic192.png')",
        }}
      >
        <ArtistImage
          id={
            artistList[0]?.id
              ? typeof artistList[0].id === "string"
                ? Number(artistList[0].id)
                : artistList[0].id
              : undefined
          }
          imageUrl={imageUrl}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 text-blue text-base font-medium pb-4 border-b border-gray-200">
          <FaRegCalendar className="text-blue text-lg" />
          <span className="text-base font-medium">
            {dayOfWeek}, {dayMonth}
          </span>
        </div>
        {name && (
          <div className="text-black text-base font-medium pt-4 ">{name}</div>
        )}
        <div className="text-pink-600 text-2xl font-bold pb-4 border-b border-gray-200 py-4">
          <Artists data={artistList} />
        </div>
        <div className="flex items-center gap-2 text-black text-base font-medium pt-6 pb-2 justify-center">
          <FaRegBuilding className="text-gray-700 text-lg" />
          <span>{venueName}</span>
        </div>
        {address && (
          <a
            rel="noreferrer"
            href={`https://www.google.com/maps/search/${venueName} ${address}`}
            target="_blank"
            className="text-black flex items-center gap-2 justify-center no-underline hover:underline pt-2 pb-2"
          >
            <FaMapMarkerAlt className="text-blue-500 text-lg" />
            <span className="block text-sm leading-5">{address}</span>
          </a>
        )}
        <div className="mt-8 md:mt-10">
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
