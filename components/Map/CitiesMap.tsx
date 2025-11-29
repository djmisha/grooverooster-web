"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { MapPin, CornerDownLeft } from "lucide-react";
import Link from "next/link";
import locations from "@/utils/locations.json";
import { toSlug } from "@/utils/getLocations";

// TopoJSON URLs for US states and Canadian provinces
const usStatesUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const canadaProvincesUrl =
  "https://cdn.jsdelivr.net/npm/canada-atlas@1/provinces-10m.json";

// Zoom threshold for showing city labels on mobile
const MOBILE_LABEL_ZOOM_THRESHOLD = 2;

interface MapLocation {
  id: number;
  city: string | null;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

interface SearchItem {
  id: string | number;
  name: string;
  state: string;
  type: string;
}

interface TooltipState {
  location: MapLocation | null;
  x: number;
  y: number;
}

// Get cities only (locations with city property) - only US and Canada
const cityLocations: MapLocation[] = (locations as MapLocation[]).filter(
  (loc) =>
    loc.city !== null && (loc.countryCode === "US" || loc.countryCode === "CA")
);

// Format cities for search
const formatCitiesForSearch = (): SearchItem[] => {
  return cityLocations.map((loc) => ({
    id: loc.id,
    name: loc.city as string,
    state: loc.state,
    type: "City",
  }));
};

export default function CitiesMap() {
  const [selectedCity, setSelectedCity] = useState<MapLocation | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    location: null,
    x: 0,
    y: 0,
  });
  const [searchItems] = useState<SearchItem[]>(formatCitiesForSearch);
  const [searchString, setSearchString] = useState("");
  const [perfectMatch, setPerfectMatch] = useState<SearchItem | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-97, 42]);
  const [zoom, setZoom] = useState(0.7);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle hydration mismatch and detect mobile
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check for perfect match when search string changes
  useEffect(() => {
    if (searchString && searchItems.length > 0) {
      const match = searchItems.find(
        (item) => item.name.toLowerCase() === searchString.toLowerCase()
      );
      setPerfectMatch(match || null);
    } else {
      setPerfectMatch(null);
    }
  }, [searchString, searchItems]);

  const handleMarkerClick = useCallback((location: MapLocation) => {
    setSelectedCity(location);
    setMapCenter([location.longitude, location.latitude]);
    setZoom(4);
  }, []);

  const handleMarkerHover = useCallback(
    (location: MapLocation | null, event?: React.MouseEvent) => {
      if (location && event) {
        setTooltip({
          location,
          x: event.clientX,
          y: event.clientY,
        });
      } else {
        setTooltip({ location: null, x: 0, y: 0 });
      }
    },
    []
  );

  const handleSelectCity = useCallback(
    (item: SearchItem) => {
      const location = cityLocations.find((loc) => loc.id === item.id);
      if (location) {
        handleMarkerClick(location);
      }
    },
    [handleMarkerClick]
  );

  const handleSearch = (string: string) => {
    setSearchString(string);
  };

  const handleEnterPress = () => {
    if (perfectMatch) {
      handleSelectCity(perfectMatch);
    }
  };

  const formatResult = (item: SearchItem) => {
    const isPerfectMatch =
      searchString && item.name.toLowerCase() === searchString.toLowerCase();

    return (
      <span
        style={{ display: "block", textAlign: "left" }}
        className={`block text-left ${isPerfectMatch ? "bg-green-100 dark:bg-green-900/30 font-semibold" : ""}`}
      >
        {item.name}, {item.state}
      </span>
    );
  };

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * 1.5, 8));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / 1.5, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setMapCenter([-97, 42]);
    setZoom(0.7);
    setSelectedCity(null);
  }, []);

  // Close popup on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCity(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getEventsUrl = useCallback((location: MapLocation) => {
    const slug = toSlug(location.city || location.state);
    return `/events/${slug}`;
  }, []);

  // Marker size based on zoom level
  const markerSize = useMemo(() => {
    return Math.max(3, 6 / zoom);
  }, [zoom]);

  // Determine if city labels should be shown
  const showCityLabels = useMemo(() => {
    // On desktop, always show labels
    if (!isMobile) return true;
    // On mobile, only show after zooming in past threshold
    return zoom >= MOBILE_LABEL_ZOOM_THRESHOLD;
  }, [isMobile, zoom]);

  // Label font size based on zoom
  const labelFontSize = useMemo(() => {
    return Math.max(8, Math.min(12, 10 / zoom));
  }, [zoom]);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search Bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="relative flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <ReactSearchAutocomplete
              items={searchItems}
              onSelect={handleSelectCity}
              onSearch={handleSearch}
              formatResult={formatResult}
              placeholder="Search for a city..."
              styling={{
                zIndex: 999,
              }}
              fuseOptions={{
                keys: ["name", "state"],
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

      {/* Map Container */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 text-xl font-bold"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 text-xl font-bold"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 text-xs font-medium"
            aria-label="Reset view"
          >
            Reset
          </button>
        </div>

        {/* Map */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 300,
            center: [-97, 42],
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            center={mapCenter}
            zoom={zoom}
            onMoveEnd={({ coordinates, zoom: newZoom }) => {
              setMapCenter(coordinates as [number, number]);
              setZoom(newZoom);
            }}
            minZoom={0.5}
            maxZoom={8}
          >
            {/* US States */}
            <Geographies geography={usStatesUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E8E8EC"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    className="dark:fill-gray-600 dark:stroke-gray-500 outline-none focus:outline-none"
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#D8D8DC" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Canadian Provinces */}
            <Geographies geography={canadaProvincesUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E8E8EC"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    className="dark:fill-gray-600 dark:stroke-gray-500 outline-none focus:outline-none"
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#D8D8DC" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* City Markers */}
            {cityLocations.map((location) => (
              <Marker
                key={location.id}
                coordinates={[location.longitude, location.latitude]}
                onMouseEnter={(e) => handleMarkerHover(location, e)}
                onMouseLeave={() => handleMarkerHover(null)}
                onClick={() => handleMarkerClick(location)}
              >
                <circle
                  r={
                    selectedCity?.id === location.id
                      ? markerSize * 1.5
                      : markerSize
                  }
                  fill={
                    selectedCity?.id === location.id ? "#ce3197" : "#1c94a5"
                  }
                  stroke="#FFFFFF"
                  strokeWidth={1}
                  className="cursor-pointer transition-all duration-200 hover:fill-pink"
                />
                {/* City label */}
                {showCityLabels && (
                  <text
                    textAnchor="middle"
                    y={-markerSize - 3}
                    style={{
                      fontSize: `${labelFontSize}px`,
                      fontFamily: "system-ui, sans-serif",
                      fontWeight:
                        selectedCity?.id === location.id ? "600" : "400",
                      fill:
                        selectedCity?.id === location.id
                          ? "#ce3197"
                          : "#374151",
                      pointerEvents: "none",
                    }}
                    className="dark:fill-gray-200"
                  >
                    {location.city}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip.location && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {tooltip.location.city}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {tooltip.location.state}
              </p>
            </div>
          </div>
        )}

        {/* Selected City Popup */}
        {selectedCity && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl px-5 py-4 border border-gray-200 dark:border-gray-700 min-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-pink" />
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {selectedCity.city}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedCity.state}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={getEventsUrl(selectedCity)}
                  className="flex-1 text-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors text-sm font-medium"
                >
                  View Events
                </Link>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue"></span>
          <span>City with Events</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-pink"></span>
          <span>Selected City</span>
        </div>
      </div>
    </div>
  );
}
