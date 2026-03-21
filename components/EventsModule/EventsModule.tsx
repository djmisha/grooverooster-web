"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { scrollToPageTop } from "@/utils/scrollUtils";
import EventCard from "@/components/EventCard/EventCard";
import NavigationBar from "@/components/Navigation/NavigataionBar";
import { searchFilter } from "@/utils/searchFilter";
import { makePageHeadline } from "@/utils/utilities";
import Filter from "@/components/Filter/Filter";
import EventsFiltered from "@/components/Filter/EventsFilter";
import EventsPagination from "@/components/EventsPagination/EventsPagination";
import GenreNav from "@/components/GenreNav/GenreNav";
import { useEventModalManager } from "@/hooks/useEventModal";
import { Event, Location } from "@/types";
import { filterPastEventsClientSide } from "@/utils/dateFilterHelpers";

interface EventsModuleProps {
  locationData: Location;
  isHome: boolean;
  events: Event[];
  initialPage?: number;
  eventId?: string;
}

/**
 * EventsModule component displays events list with filtering, search, and pagination
 */
const EventsModule = ({
  locationData,
  isHome: _isHome,
  events: initialEvents,
  initialPage = 1,
  eventId: _eventId,
}: EventsModuleProps) => {
  const router = useRouter();
  const { openEventId, setOpenEventId } = useEventModalManager(); // Use the hook
  const [filterVisible, setFilterVisible] = useState(false);

  // Filter out past events based on user's local timezone
  const filteredInitialEvents = useMemo(
    () => filterPastEventsClientSide(initialEvents),
    [initialEvents]
  );

  const [events, setEvents] = useState(filteredInitialEvents);
  const [allEvents, setAllEvents] = useState(filteredInitialEvents); // Store original events
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lastPageBeforeFilter, setLastPageBeforeFilter] = useState(initialPage); // Remember page before filtering
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null); // Track selected genre
  const eventsPerPage = 21;
  const { city, state, id } = locationData;
  const title = makePageHeadline(city, state);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const dataFetchedRef = useRef<string | number | undefined>(undefined);
  const searchTermRef = useRef<string>("");

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    setFilterVisible(false);
    setSelectedGenre(null); // Reset genre selection on location change
    setCurrentPage(initialPage); // Use initial page from props
    setLastPageBeforeFilter(initialPage);
    setAllEvents(filteredInitialEvents); // Update stored original events (already filtered)
  }, [id, filteredInitialEvents, initialPage]);

  useEffect(() => {
    if (searchTerm && allEvents) {
      const filteredEvents = searchFilter(searchTerm, allEvents);
      if (filteredEvents) {
        // Store current page before filtering
        if (!filterVisible) {
          setLastPageBeforeFilter(currentPage);
        }
        setEvents(filteredEvents);
        searchTermRef.current = searchTerm;
        setFilterVisible(true);
        setSearchTerm("");
        scrollToPageTop();
      }
    }
  }, [searchTerm, allEvents, currentPage, filterVisible]);

  /** Filters an event list by the given genre */
  const filterEventsByGenre = useCallback(
    (eventsToFilter: Event[], genre: string | null): Event[] => {
      if (!genre) return eventsToFilter;
      return eventsToFilter.filter(
        (event) =>
          Array.isArray(event.genres) &&
          event.genres.some((g) => g.name === genre)
      );
    },
    []
  );

  /** Returns the slice of events to display on the current page */
  const displayEvents = useMemo(() => {
    if (filterVisible) return events;
    const startIndex = (currentPage - 1) * eventsPerPage;
    const baseEvents = allEvents.slice(startIndex, startIndex + eventsPerPage);
    return filterEventsByGenre(baseEvents, selectedGenre);
  }, [
    filterVisible,
    events,
    currentPage,
    eventsPerPage,
    allEvents,
    selectedGenre,
    filterEventsByGenre,
  ]);

  /** Total number of events used by the pagination widget */
  const visibleEventsCount = useMemo(() => {
    if (filterVisible) {
      return events.filter((event) => event.isVisible !== false).length;
    }
    if (selectedGenre) {
      return filterEventsByGenre(allEvents, selectedGenre).length;
    }
    return allEvents.length;
  }, [filterVisible, events, selectedGenre, allEvents, filterEventsByGenre]);

  /** Handles genre pill selection and resets to page 1 */
  const handleGenreSelect = useCallback(
    (genre: string | null) => {
      setSelectedGenre(genre);
      if (currentPage !== 1) {
        setCurrentPage(1);
        router.replace(`/events/${locationData.slug}`, { scroll: false });
      }
      scrollToPageTop();
    },
    [currentPage, locationData.slug, router]
  );

  /** Handles pagination page changes */
  const handlePageChange = useCallback(
    (pageNumber: number) => {
      setCurrentPage(pageNumber);
      scrollToPageTop();
      const newUrl =
        pageNumber === 1
          ? `/events/${locationData.slug}`
          : `/events/${locationData.slug}?page=${pageNumber}`;
      router.replace(newUrl, { scroll: false });
    },
    [locationData.slug, router]
  );

  /** Clears active search/date filter and restores the previous page */
  const handleClearFilter = useCallback(() => {
    setFilterVisible(false);
    setCurrentPage(lastPageBeforeFilter);
    scrollToPageTop();
    const newUrl =
      lastPageBeforeFilter === 1
        ? `/events/${locationData.slug}`
        : `/events/${locationData.slug}?page=${lastPageBeforeFilter}`;
    router.replace(newUrl, { scroll: false });
  }, [lastPageBeforeFilter, locationData.slug, router]);

  return (
    <>
      {events && (
        <NavigationBar
          setSearchTerm={setSearchTerm}
          locationData={[locationData]}
        />
      )}
      <div
        className="flex flex-col md:p-5 md:flex-row-reverse max-w-[1440] m-auto"
        id="top"
      >
        <section className="md:w-full md:pb-20 [&_h1]:border-none [&_h1]:text-left [&_h1]:pb-2.5 [&_h1]:leading-tight">
          <h1 className="mt-4 text-[16px] pl-2 text-gray-800 dark:text-gray-100 text-left font-semibold md:mt-4 md:mb-4 md:block md:text-[20px]">
            {title}
          </h1>
          <EventsFiltered events={events} setSearchTerm={setSearchTerm} />
          <Filter
            events={events}
            setEvents={setEvents}
            searchTerm={searchTermRef.current}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
            onClearFilter={handleClearFilter}
          />
          {/* Genre Navigation - shown below filters, above event listings */}
          {!filterVisible && allEvents.length > 0 && (
            <GenreNav
              events={allEvents}
              selectedGenre={selectedGenre}
              onGenreSelect={handleGenreSelect}
            />
          )}
          <div className="grid grid-cols-1 gap-4 p-0 px-2.5 pb-10 pt-3 md:pt-6 transition-all duration-300 ease-out md:grid-cols-2 md:gap-8 xl:grid-cols-3">
            {displayEvents?.map((event) => {
              return (
                <EventCard
                  event={event}
                  key={event.id}
                  openEventId={openEventId}
                  setOpenEventId={setOpenEventId}
                  allEvents={allEvents}
                />
              );
            })}
          </div>

          {/* Show pagination only when not filtering */}
          {!filterVisible && (
            <EventsPagination
              currentPage={currentPage}
              totalEvents={visibleEventsCount}
              eventsPerPage={eventsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default EventsModule;
