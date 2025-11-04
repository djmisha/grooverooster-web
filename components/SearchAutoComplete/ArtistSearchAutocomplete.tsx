"use client";

import { useState, useEffect, useMemo } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { X } from "lucide-react";

interface Artist {
  id?: string | number;
  name: string;
  count?: number;
  locations?: number;
}

interface SearchItem {
  id: string | number;
  name: string;
}

interface ArtistSearchAutocompleteProps {
  artists: Artist[];
  onSearchChange: (searchString: string) => void;
}

/**
 * ArtistSearchAutocomplete component provides a search interface
 * for filtering artists in real-time
 */
function ArtistSearchAutocomplete({
  artists,
  onSearchChange,
}: ArtistSearchAutocompleteProps) {
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Format artists data for search component
  const searchItems: SearchItem[] = useMemo(
    () =>
      artists
        .filter((artist) => artist.id !== undefined)
        .map((artist, index) => ({
          id: artist.id || index,
          name: artist.name,
        })),
    [artists]
  );

  useEffect(() => {
    // Small delay to prevent layout shift
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleOnSearch = (string: string) => {
    setSearchString(string);
    onSearchChange(string);
  };

  const handleOnSelect = (item: SearchItem) => {
    setSearchString(item.name);
    onSearchChange(item.name);
  };

  const handleClear = () => {
    setSearchString("");
    onSearchChange("");
  };

  const formatResult = (item: SearchItem) => {
    const isMatch =
      searchString &&
      item.name.toLowerCase().includes(searchString.toLowerCase());

    return (
      <span
        style={{ display: "block", textAlign: "left" }}
        className={`block text-left ${isMatch ? "font-medium" : ""}`}
      >
        {item.name}
      </span>
    );
  };

  if (isLoading) {
    // Skeleton loader to prevent layout shift
    return (
      <div className="w-full max-w-full">
        <div className="relative flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
          </div>
          <div className="flex-shrink-0 h-11 w-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <div className="relative flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <ReactSearchAutocomplete
            items={searchItems}
            onSelect={handleOnSelect}
            onSearch={handleOnSearch}
            formatResult={formatResult}
            placeholder="Search for an artist..."
            showIcon={true}
            inputSearchString={searchString}
            styling={{
              zIndex: 999,
            }}
          />
        </div>
        {searchString && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 h-11 w-11 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ArtistSearchAutocomplete;
