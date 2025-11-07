import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../features/AppContext";
import ShareLocation from "../ShareLocation/ShareLocation";
import Button from "../Button/Button";
import LocationSwitch from "../LocationSwitch/LocationSwitch";
import {
  getSavedLocation,
  getLocationEventsUrl,
  hasValidLocationUrl,
} from "../../utils/locationService";
import { Location } from "@/types";

interface LocationManagerProps {
  onLocationChanged?: (location: Location) => void;
  showCurrentLocation?: boolean;
  showShareButton?: boolean;
  showLocationSwitch?: boolean;
  className?: string;
  title?: string;
}

const LocationManager = ({
  onLocationChanged,
  showCurrentLocation = true,
  showShareButton = true,
  showLocationSwitch = true,
  className = "",
  title = "Location Settings",
}: LocationManagerProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("LocationManager must be used within AppProvider");
  }

  const { addLocation } = context;

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      addLocation(savedLocation);

      if (onLocationChanged) {
        onLocationChanged(savedLocation);
      }
    }
  }, [addLocation, onLocationChanged]);

  const handleLocationDetected = (location: Location) => {
    setCurrentLocation(location);
    setHasError(false);
    setErrorMessage("");

    if (onLocationChanged) {
      onLocationChanged(location);
    }
  };

  const handleLocationError = (error: { message: string }) => {
    setHasError(true);
    setErrorMessage(error.message);
  };

  const handleLocationChanged = (location: Location) => {
    setCurrentLocation(location);
    setHasError(false);
    setErrorMessage("");

    if (onLocationChanged) {
      onLocationChanged(location);
    }
  };

  const handleClearLocation = () => {
    setCurrentLocation(null);
    // updateUserLocation doesn't handle null, so we skip it
    setHasError(false);
    setErrorMessage("");

    if (onLocationChanged) {
      onLocationChanged(null as any); // Type assertion needed for callback
    }
  };

  const formatLocationDisplay = (location: Location | null) => {
    if (!location) return "";

    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    } else if (location.state) {
      return location.state;
    }
    return location.city || "";
  };

  return (
    <div
      className={`flex flex-col gap-6 bg-white rounded-lg p-0 max-w-full w-full m-0 md:gap-4 dark:bg-gray-800 dark:text-gray-100 ${className}`}
    >
      {title && (
        <h3 className="font-normal text-lg md:inline-block m-0 text-2xl font-bold text-gray-900 dark:text-gray-100 pb-2 border-b-2 border-gray-300 dark:border-gray-600 tracking-tight">
          {title}
        </h3>
      )}

      {showCurrentLocation && currentLocation && (
        <div className="flex flex-col p-5 bg-blue-50 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-lg gap-4 relative">
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Selected Location
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatLocationDisplay(currentLocation)}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {hasValidLocationUrl(currentLocation) && (
              <Button
                href={getLocationEventsUrl(currentLocation) || undefined}
                className="flex-1 min-w-[180px]"
              >
                View Events
              </Button>
            )}
            <Button
              onClick={handleClearLocation}
              variant="secondary"
              className="flex-1 min-w-[140px]"
              aria-label="Clear location"
            >
              Clear Location
            </Button>
          </div>
        </div>
      )}

      {hasError && (
        <div
          className="p-3 px-4 bg-red-100 text-red-800 border border-red-200 rounded-lg text-sm leading-6 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {showLocationSwitch && (
        <div className="flex flex-col gap-3 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              🔍 Manual Location Search
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Type a city name below to search and select your location
              manually.
            </p>
          </div>
          <LocationSwitch
            onLocationChanged={handleLocationChanged}
            placeholder="Search cities or states..."
          />
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-5">
        {showShareButton && (
          <div className="flex flex-col gap-3 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                📍 Automatic Location Detection
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Click the button below to automatically detect your location
                using your browser&apos;s location services.
              </p>
            </div>
            <ShareLocation
              onLocationDetected={handleLocationDetected}
              onLocationError={handleLocationError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationManager;
