import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { Location } from "@/types";
import {
  getSavedLocation,
  getLocationEventsUrl,
  detectUserLocation,
} from "@/utils/locationService";

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
  const [isDetecting, setIsDetecting] = useState(false);

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
      setIsDetecting(true);
      const url = getEventsUrl();
      if (url) {
        router.push(url);
        // Keep loading state active during navigation
        // The loading indicator will remain until the page loads
      }
    } else {
      setIsDetecting(true);
      try {
        const location = await detectUserLocation();
        if (location) {
          setCurrentLocation(location);
          setHasLocationCookie(true);
          // Navigation will happen on next render when currentLocation is set
          const url = getLocationEventsUrl(location);
          if (url) {
            router.push(url);
            // Keep loading state active during navigation
          }
        } else {
          setIsDetecting(false);
          alert(
            "Unable to detect your location. Please try again or select manually."
          );
        }
      } catch (error) {
        setIsDetecting(false);
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
      <Button
        onClick={handleButtonClick}
        variant="primary"
        className="w-full"
        isLoading={isDetecting}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default QuickLocationFinder;
