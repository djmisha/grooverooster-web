import { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { formatDataforSearch } from "./HomeSearchAutocomplete.helpers";
import { toSlug } from "../../utils/getLocations";
import { ToSlugArtist } from "../../utils/utilities";
import { CornerDownLeft } from "lucide-react";

function HomeSearchAutocomplete() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [perfectMatch, setPerfectMatch] = useState(null);

  useEffect(() => {
    // Load data with a slight delay to ensure proper rendering
    const loadData = () => {
      const data = formatDataforSearch();
      setItems(data);
      setIsLoading(false);
    };

    // Use setTimeout to prevent layout shift
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check for perfect match when search string changes
    if (searchString && items.length > 0) {
      const match = items.find(
        (item) => item.name.toLowerCase() === searchString.toLowerCase()
      );
      setPerfectMatch(match || null);
    } else {
      setPerfectMatch(null);
    }
  }, [searchString, items]);

  const navigateToItem = (item) => {
    const { name, type } = item;
    if (type === "Artist") {
      const url = `artist/${ToSlugArtist(name)}`;
      window.location.assign(url);
    }
    if (type === "City" || type === "State") {
      const url = `events/${toSlug(item.name)}`;
      window.location.assign(url);
    }
  };

  const handleOnSelect = (item) => {
    navigateToItem(item);
  };

  const handleOnSearch = (string) => {
    setSearchString(string);
  };

  const handleEnterPress = () => {
    if (perfectMatch) {
      navigateToItem(perfectMatch);
    }
  };

  const formatResult = (item) => {
    const isPerfectMatch =
      searchString && item.name.toLowerCase() === searchString.toLowerCase();

    return (
      <span
        style={{ display: "block", textAlign: "left" }}
        className={`block text-left ${isPerfectMatch ? "bg-green-100 dark:bg-green-900/30 font-semibold" : ""}`}
      >
        <b>{item.type}:</b> {item.name}
      </span>
    );
  };

  if (isLoading) {
    // Skeleton loader with exact dimensions to prevent layout shift
    return (
      <div className="w-full max-w-full">
        <div className="relative flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
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
            items={items}
            onSelect={handleOnSelect}
            onSearch={handleOnSearch}
            formatResult={formatResult}
            placeholder="Search for Artist, City or State"
            styling={{
              zIndex: 999,
            }}
          />
        </div>
        <button
          onClick={handleEnterPress}
          disabled={!perfectMatch}
          className={`flex-shrink-0 h-11 w-11 flex items-center justify-center rounded-lg transition-all ${
            perfectMatch
              ? "bg-green hover:bg-green/90 text-white"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
          }`}
          title={perfectMatch ? "Press Enter to select" : "Type to search"}
          aria-label="Submit search"
        >
          <CornerDownLeft size={20} />
        </button>
      </div>
    </div>
  );
}

export default HomeSearchAutocomplete;
