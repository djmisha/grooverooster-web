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
      className={`flex flex-col gap-6 bg-white  rounded-lg p-0 max-w-full w-full m-0 md:gap-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${className}`}
    >
      {title && (
        <h3 className="m-0 text-2xl font-bold text-blue-600 pb-2 border-b-2 border-blue-500 tracking-tight">
          {title}
        </h3>
      )}

      {showCurrentLocation && currentLocation && (
        <div className="flex items-center justify-between p-4 bg-blue-400 border border-gray-400 rounded-lg gap-4 md:flex-col md:items-start md:gap-3 relative">
          <div className="flex flex-col gap-1 flex-1 md:w-full">
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              Current Location:
            </span>
            <div className="flex items-center gap-4 flex-wrap md:gap-3">
              <span className="text-lg font-medium text-gray-900">
                {formatLocationDisplay(currentLocation)}
              </span>
              {hasValidLocationUrl(currentLocation) && (
                <Button
                  href={getLocationEventsUrl(currentLocation) || undefined}
                  className="ml-2"
                >
                  View Events
                </Button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearLocation}
            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-black text-white border-none rounded-full text-base font-bold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:scale-110 active:scale-95 focus:outline-none focus:shadow-[0_0_0_3px_rgba(244,67,54,0.25)] z-10"
            aria-label="Clear current location"
          >
            ✕
          </button>
        </div>
      )}

      {hasError && (
        <div
          className="p-3 px-4 bg-red-100 text-red-800 border border-red-200 rounded-lg text-sm leading-6 contrast-[high]:border-2 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-4">
        {showLocationSwitch && (
          <div className="flex flex-col gap-3">
            <div className="text-base font-medium text-gray-600 mb-2">
              Search for a location:
            </div>
            <LocationSwitch
              onLocationChanged={handleLocationChanged}
              placeholder="Search cities or states..."
            />
          </div>
        )}

        {showShareButton && (
          <div className="flex flex-col gap-3">
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
