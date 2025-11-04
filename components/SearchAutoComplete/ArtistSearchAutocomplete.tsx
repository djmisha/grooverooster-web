"use client";

import { useState, useEffect, useMemo } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

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
          id: artist.id ?? index,
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
      <span className={`block text-left ${isMatch ? "font-medium" : ""}`}>
        {item.name}
      </span>
    );
  };

  if (isLoading) {
    // Skeleton loader to prevent layout shift
    return (
      <div className="w-full max-w-full">
        <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full artist-search-wrapper">
      <style jsx>{`
        .artist-search-wrapper :global(ul) {
          display: none !important;
        }
      `}</style>
      <ReactSearchAutocomplete
        items={searchItems}
        onSelect={handleOnSelect}
        onSearch={handleOnSearch}
        onClear={handleClear}
        formatResult={formatResult}
        placeholder="Search for an artist..."
        showIcon={true}
        showClear={true}
        inputSearchString={searchString}
        maxResults={0}
        styling={{
          zIndex: 999,
          height: "44px",
          border: "1px solid #dfe1e5",
          borderRadius: "24px",
          backgroundColor: "white",
          boxShadow: "none",
          hoverBackgroundColor: "#f8f9fa",
          color: "#212121",
          fontSize: "16px",
          iconColor: "#4d5156",
          lineColor: "#dfe1e5",
          placeholderColor: "#70757a",
          clearIconMargin: "3px 8px 0 0",
        }}
      />
    </div>
  );
}

export default ArtistSearchAutocomplete;
