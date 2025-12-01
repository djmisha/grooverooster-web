"use client";

import React from "react";
import ArtistImage from "@/components/Artists/ArtistImage";
import setDates from "@/utils/setDates";
import { FaRegCalendar, FaRegBuilding } from "react-icons/fa";
import { Event } from "@/types";
import { getFirstArtistImageId } from "@/utils/artistImageLookup";

interface RelatedEventCardProps {
  event: Event;
  onClick: () => void;
}

/**
 * RelatedEventCard component displays a compact event card for use in carousels
 * Shows image, date, venue, and artists in a smaller format
 */
const RelatedEventCard = ({ event, onClick }: RelatedEventCardProps) => {
  const { date, artistlist, venue, image } = event;

  // Support both old and new field names during transition
  const artistList = artistlist || event.artistList || [];
  const { name: venueName } = venue;
  const { dayMonth } = setDates(date);

  // Get first artist name for display
  const firstArtistName =
    artistList.length > 0 ? artistList[0]?.name : "Unknown Artist";
  const additionalArtists = artistList.length > 1 ? artistList.length - 1 : 0;

  /**
   * Handles keyboard interaction for opening the modal
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="flex-shrink-0 w-[260px] md:w-[280px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer shadow-sm dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200 hover:shadow-md dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${firstArtistName} at ${venueName} on ${dayMonth}`}
    >
      {/* Image Section */}
      <div className="w-full h-28 bg-no-repeat bg-cover">
        <ArtistImage id={getFirstArtistImageId(artistList)} image={image} />
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col gap-2">
        {/* Artist Name */}
        <div className="font-semibold text-sm text-pink dark:text-pink-400 leading-tight truncate">
          {firstArtistName}
          {additionalArtists > 0 && (
            <span className="text-gray-400 dark:text-gray-500 font-normal text-xs ml-1">
              +{additionalArtists}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FaRegCalendar className="text-gray-400 dark:text-gray-500 text-[10px]" />
          <span>{dayMonth}</span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FaRegBuilding className="text-gray-400 dark:text-gray-500 text-[10px]" />
          <span className="truncate">{venueName}</span>
        </div>
      </div>
    </div>
  );
};

export default RelatedEventCard;
