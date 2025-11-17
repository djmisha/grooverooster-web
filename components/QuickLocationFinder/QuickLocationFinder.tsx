import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../Button/Button";
import { Location } from "@/types";
import {
  getSavedLocation,
  getLocationEventsUrl,
  detectUserLocation,
} from "../../utils/locationService";

interface QuickLocationFinderProps {
  className?: string;
}

/**
 * QuickLocationFinder component detects user location and provides quick access to local events
 */
const QuickLocationFinder = ({ className = "" }: QuickLocationFinderProps) => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [hasLocationCookie, setHasLocationCookie] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved location on mount
  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      setHasLocationCookie(true);
    } else {
      setHasLocationCookie(false);
    }
    setIsLoading(false);
  }, []);

  const formatLocationDisplay = (location: Location | null): string => {
    if (!location) return "";

    if (location.city && (location.stateCode || location.state)) {
      return `${location.city}, ${location.stateCode || location.state}`;
    } else if (location.stateCode || location.state) {
      return location.stateCode || location.state;
    }
    return location.city || "";
  };

  const getEventsUrl = () => {
    if (!currentLocation) return "#";
    return getLocationEventsUrl(currentLocation);
  };

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full h-12 bg-pink/20 animate-pulse rounded-full" />
      </div>
    );
  }

  const handleButtonClick = async () => {
    if (hasLocationCookie && currentLocation) {
      const url = getEventsUrl();
      if (url) {
        router.push(url);
      }
    } else {
      try {
        const location = await detectUserLocation();
        if (location) {
          setCurrentLocation(location);
          setHasLocationCookie(true);
        } else {
          alert(
            "Unable to detect your location. Please try again or select manually."
          );
        }
      } catch (error) {
        alert(
          "Unable to detect your location. Please try again or select manually."
        );
      }
    }
  };

  const buttonText =
    hasLocationCookie && currentLocation
      ? `View events in ${formatLocationDisplay(currentLocation)}`
      : "Share your location";

  return (
    <div className={`w-full ${className}`}>
      <Button onClick={handleButtonClick} variant="primary" className="w-full">
        {buttonText}
      </Button>
    </div>
  );
};

export default QuickLocationFinder;
