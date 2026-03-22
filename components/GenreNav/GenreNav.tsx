"use client";

import { useRef, useEffect, useState } from "react";
import { Event } from "@/types";

interface GenreNavProps {
  events: Event[];
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
}

/**
 * GenreNav component provides horizontal pill-based genre navigation
 * for filtering events by genre
 */
const GenreNav = ({ events, selectedGenre, onGenreSelect }: GenreNavProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Extract unique genres from events, sorted alphabetically
  // Dance/Electronic should be first after "All"
  const getGenres = (): string[] => {
    const genreSet = new Set<string>();
    events.forEach((event) => {
      if (event.genres && Array.isArray(event.genres)) {
        event.genres.forEach((genre) => {
          if (genre.name) {
            genreSet.add(genre.name);
          }
        });
      }
    });

    const genres = Array.from(genreSet).sort();

    // Move Dance/Electronic to the front if it exists
    const danceElectronicIndex = genres.findIndex(
      (g) => g.toLowerCase() === "dance/electronic"
    );
    if (danceElectronicIndex > -1) {
      const [danceElectronic] = genres.splice(danceElectronicIndex, 1);
      genres.unshift(danceElectronic);
    }

    return genres;
  };

  const genres = getGenres();

  // Mouse drag handlers for smooth scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile swipe
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchScrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].pageX - container.offsetLeft;
      touchScrollLeft = container.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - touchStartX) * 2;
      container.scrollLeft = touchScrollLeft - walk;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const handleGenreClick = (genre: string | null) => {
    onGenreSelect(genre);
  };

  const handleKeyDown = (e: React.KeyboardEvent, genre: string | null) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleGenreClick(genre);
    }
  };

  if (genres.length === 0) {
    return null; // Don't show if no genres available
  }

  return (
    <nav
      className="w-full bg-white dark:bg-background transition-colors duration-200 pt-2 pb-3"
      aria-label="Genre navigation"
    >
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto px-2.5 scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        role="list"
      >
        {/* "All" pill */}
        <button
          onClick={() => handleGenreClick(null)}
          onKeyDown={(e) => handleKeyDown(e, null)}
          className={`
            px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium
            transition-all duration-200 flex-shrink-0
            focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2
            dark:focus:ring-offset-gray-900
            ${
              selectedGenre === null
                ? "bg-pink text-white shadow-md hover:bg-pink/90"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }
          `}
          aria-label="Show all genres"
          role="button"
        >
          All
        </button>

        {/* Genre pills */}
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            onKeyDown={(e) => handleKeyDown(e, genre)}
            className={`
              px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium
              transition-all duration-200 flex-shrink-0
              focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2
              dark:focus:ring-offset-gray-900
              ${
                selectedGenre === genre
                  ? "bg-pink text-white shadow-md hover:bg-pink/90"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
            aria-label={`Filter by ${genre}`}
            role="button"
          >
            {genre}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default GenreNav;
