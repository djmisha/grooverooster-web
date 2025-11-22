"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  let [filterVisible, setFilterVisible] = useState(false);

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
        window.location.href = "#top";
      }
    }
  }, [searchTerm, allEvents, currentPage, filterVisible]);

  // Helper function to filter events by genre
  const filterEventsByGenre = (
    eventsToFilter: Event[],
    genre: string | null
  ): Event[] => {
    if (!genre) {
      return eventsToFilter;
    }

    return eventsToFilter.filter((event) => {
      if (event.genres && Array.isArray(event.genres)) {
        return event.genres.some((g) => g.name === genre);
      }
      return false;
    });
  };

  // Helper function to get events for current page when not filtering
  const getPaginatedEvents = () => {
    if (filterVisible) {
      // When filtering, show all filtered events (no pagination)
      return events;
    }

    // When not filtering, show paginated events
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const baseEvents = allEvents.slice(startIndex, endIndex);

    // Apply genre filter if selected
    return filterEventsByGenre(baseEvents, selectedGenre);
  };

  // Get total count of visible events for pagination info
  const getVisibleEventsCount = () => {
    if (filterVisible) {
      return events.filter((event) => event.isVisible !== false).length;
    }
    // When genre is selected, count filtered events
    if (selectedGenre) {
      return filterEventsByGenre(allEvents, selectedGenre).length;
    }
    return allEvents.length;
  };

  // Handle genre selection
  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
    // Reset to page 1 when genre changes
    if (currentPage !== 1) {
      setCurrentPage(1);
      const newUrl =
        genre === null
          ? `/events/${locationData.slug}`
          : `/events/${locationData.slug}`;

      // Scroll to top immediately
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      router.replace(newUrl, { scroll: false });
    } else {
      // Just scroll to top if already on page 1
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    // Scroll to top immediately
    const topElement = document.getElementById("top");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update URL to include page number using slug instead of id
    const newUrl =
      pageNumber === 1
        ? `/events/${locationData.slug}`
        : `/events/${locationData.slug}?page=${pageNumber}`;

    // Use router.replace to update URL without full navigation
    router.replace(newUrl, { scroll: false });
  };

  // Function to handle clearing filters and returning to remembered page
  const handleClearFilter = () => {
    setFilterVisible(false);
    setCurrentPage(lastPageBeforeFilter);

    // Scroll to top immediately
    const topElement = document.getElementById("top");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update URL to remembered page using slug instead of id
    const newUrl =
      lastPageBeforeFilter === 1
        ? `/events/${locationData.slug}`
        : `/events/${locationData.slug}?page=${lastPageBeforeFilter}`;

    router.replace(newUrl, { scroll: false });
  };

  const displayEvents = getPaginatedEvents();

  return (
    <>
      {events && (
        <NavigationBar
          setSearchTerm={setSearchTerm}
          locationData={[locationData]}
        />
      )}
      <div className="flex flex-col md:p-5 md:flex-row-reverse" id="top">
        <section className="md:w-full md:pb-20 [&_h1]:border-none [&_h1]:text-left [&_h1]:pb-2.5 [&_h1]:leading-tight">
          <h1 className="mt-4 text-[16px] pl-2 text-gray-500 text-left font-normal  md:mt-4 md:mb-6 md:block md:text-[20px]">
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
          <div className="grid grid-cols-1 gap-4 p-0 px-2.5 pb-10 pt-4 md:pt-10 transition-all duration-300 ease-out md:grid-cols-2 md:gap-8 xl:grid-cols-3">
            {displayEvents?.map((event) => {
              return (
                <EventCard
                  event={event}
                  key={event.id}
                  openEventId={openEventId}
                  setOpenEventId={setOpenEventId}
                />
              );
            })}
          </div>

          {/* Show pagination only when not filtering */}
          {!filterVisible && (
            <EventsPagination
              currentPage={currentPage}
              totalEvents={getVisibleEventsCount()}
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
