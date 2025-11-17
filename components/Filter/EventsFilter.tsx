import {
  makeVenues,
  makeSeries,
  makeArtists,
  makeVenuesWithCounts,
  makeSeriesWithCounts,
  makeArtistsWithCounts,
} from "../../utils/utilities";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaFilter,
  FaRecycle,
} from "react-icons/fa";
import { useState } from "react";
import MenuOverlay from "../ui/MenuOverlay";
import MenuList from "../Navigation/MenuList";
import DatePickerFilter from "./DatePickerFilter";
import { Event } from "@/types";

interface EventsFilterProps {
  events: Event[];
  setSearchTerm: (term: string) => void;
}

/**
 * EventsFilter component provides filtering UI for events by venue, artist, date, and promoter
 */
const EventsFilter = ({ events, setSearchTerm }: EventsFilterProps) => {
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isVenueMenuOpen, setIsVenueMenuOpen] = useState(false);
  const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
  const [isSeriesMenuOpen, setIsSeriesMenuOpen] = useState(false);

  const venues = makeVenues(events ?? []);
  const artists = makeArtists(events ?? []);
  const series = makeSeries(events ?? []);

  // Get items with counts for display
  const venuesWithCounts = makeVenuesWithCounts(events ?? []);
  const artistsWithCounts = makeArtistsWithCounts(events ?? []);
  const seriesWithCounts = makeSeriesWithCounts(events ?? []);

  // Calculate statistics from events data
  const getStatistics = () => {
    if (!events || events.length === 0) {
      return {
        totalEvents: 0,
        totalVenues: 0,
        totalArtists: 0,
        totalSeries: 0,
      };
    }

    // Get visible events (when filtering is active)
    const visibleEvents = events.filter((event) => event.isVisible !== false);

    // Count unique venues
    const uniqueVenues = new Set();
    const uniqueArtists = new Set();

    visibleEvents.forEach((event) => {
      // Count unique venues
      if (event.venue && event.venue.name) {
        uniqueVenues.add(event.venue.name);
      }

      // Count unique artists
      const artistList = event.artistlist || event.artistList || [];
      artistList.forEach((artist) => {
        if (artist.name) {
          uniqueArtists.add(artist.name);
        }
      });
    });

    return {
      totalEvents: visibleEvents.length,
      totalVenues: uniqueVenues.size,
      totalArtists: uniqueArtists.size,
      totalSeries: series.length,
    };
  };

  const { totalEvents, totalVenues, totalArtists, totalSeries } =
    getStatistics();

  return (
    <div className="relative w-[calc(100%-20px)] m-2.5 mb-3 bg-white dark:bg-gray-900 transition-colors duration-200 z-10">
      <div className="relative flex flex-nowrap items-center justify-around w-full pb-0 bg-white dark:bg-gray-900 text-lg font-semibold border-none left-0 z-[800] md:justify-center md:m-0">
        <div className="hidden h-12 w-32 items-center gap-2 border border-light-grey dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-200 transition-colors duration-200 md:flex">
          <FaFilter className="text-xs text-gray-400 dark:text-gray-400" />
          <span className="whitespace-nowrap">Filter By</span>
        </div>
        <div className="flex w-full mx-auto justify-between gap-1 md:gap-4">
          <div className="flex flex-1 items-center justify-center">
            <div
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2.5 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:translate-y-0 md:gap-4 md:px-4 md:py-3"
              onClick={() => setIsDateMenuOpen(true)}
            >
              <FaCalendarAlt className="text-base text-gray-400 dark:text-gray-400 md:text-xl" />
              <div className="flex flex-col items-start justify-center gap-0.0 md:flex-row md:items-center md:gap-1.5">
                <div className="text-sm font-normal leading-tight text-gray-500 dark:text-gray-300 md:text-md">
                  {totalEvents.toLocaleString()}
                </div>
                <div className="text-xs font-medium uppercase leading-tight tracking-wide text-gray-500 dark:text-gray-300 md:text-sm md:tracking-normal">
                  {totalEvents === 1 ? "Date" : "Dates"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isDateMenuOpen}
              onClose={() => setIsDateMenuOpen(false)}
            >
              <DatePickerFilter
                events={events}
                setSearchTerm={setSearchTerm}
                onClose={() => setIsDateMenuOpen(false)}
              />
            </MenuOverlay>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2.5 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:translate-y-0 md:gap-4 md:px-4 md:py-3"
              onClick={() => setIsVenueMenuOpen(true)}
            >
              <FaMapMarkerAlt className="text-base text-gray-400 dark:text-gray-400 md:text-xl" />
              <div className="flex flex-col items-start justify-center gap-0.0 md:flex-row md:items-center md:gap-1.5">
                <div className="text-sm font-normal leading-tight text-gray-500 dark:text-gray-300 md:text-md">
                  {totalVenues.toLocaleString()}
                </div>
                <div className="text-xs font-medium uppercase leading-tight tracking-wide text-gray-500 dark:text-gray-300 md:text-sm md:tracking-normal">
                  {totalVenues === 1 ? "Venue" : "Venues"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isVenueMenuOpen}
              onClose={() => setIsVenueMenuOpen(false)}
            >
              <div className="max-h-[80vh] overflow-y-auto p-4">
                <h2 className="m-0 mb-4 mt-10 text-xl font-semibold text-gray-600 dark:text-gray-300 md:inline-block">
                  Venues
                </h2>
                <MenuList
                  navItems={venues}
                  navItemsWithCounts={venuesWithCounts}
                  text="venue"
                  isOpen={isVenueMenuOpen}
                  title="Venues"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsVenueMenuOpen(false)}
                  showCounts={true}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2.5 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:translate-y-0 md:gap-4 md:px-4 md:py-3"
              onClick={() => setIsArtistMenuOpen(true)}
            >
              <FaUser className="text-base text-gray-400 dark:text-gray-400 md:text-xl" />
              <div className="flex flex-col items-start justify-center gap-0.0 md:flex-row md:items-center md:gap-1.5">
                <div className="text-sm font-normal leading-tight text-gray-500 dark:text-gray-300 md:text-md">
                  {totalArtists.toLocaleString()}
                </div>
                <div className="text-xs font-medium uppercase leading-tight tracking-wide text-gray-500 dark:text-gray-300 md:text-sm md:tracking-normal">
                  {totalArtists === 1 ? "Artist" : "Artists"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isArtistMenuOpen}
              onClose={() => setIsArtistMenuOpen(false)}
            >
              <div className="max-h-[80vh] overflow-y-auto p-4">
                <h2 className="m-0 mb-4 mt-10 text-xl font-semibold text-gray-600 dark:text-gray-300 md:inline-block">
                  Artists
                </h2>
                <MenuList
                  navItems={artists}
                  navItemsWithCounts={artistsWithCounts}
                  text="artist"
                  isOpen={isArtistMenuOpen}
                  title="Artists"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsArtistMenuOpen(false)}
                  showCounts={false}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2.5 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:translate-y-0 md:gap-4 md:px-4 md:py-3"
              onClick={() => setIsSeriesMenuOpen(true)}
            >
              <FaRecycle className="text-base text-gray-400 dark:text-gray-400 md:text-xl" />
              <div className="flex flex-col items-start justify-center gap-0.0 md:flex-row md:items-center md:gap-1.5">
                <div className="text-sm font-normal leading-tight text-gray-500 dark:text-gray-300 md:text-md">
                  {totalSeries.toLocaleString()}
                </div>
                <div className="text-xs font-medium uppercase leading-tight tracking-wide text-gray-500 dark:text-gray-300 md:text-sm md:tracking-normal">
                  {totalSeries === 1 ? "Series" : "Series"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isSeriesMenuOpen}
              onClose={() => setIsSeriesMenuOpen(false)}
            >
              <div className="max-h-[80vh] overflow-y-auto p-4">
                <h2 className="m-0 mb-4 mt-10 text-xl font-semibold text-gray-600 dark:text-gray-300 md:inline-block">
                  Series
                </h2>
                <MenuList
                  navItems={series}
                  navItemsWithCounts={seriesWithCounts}
                  text="series"
                  title="Series"
                  isOpen={isSeriesMenuOpen}
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsSeriesMenuOpen(false)}
                  showCounts={true}
                />
              </div>
            </MenuOverlay>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsFilter;
