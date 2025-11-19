import React, { useState, useContext, ReactNode } from "react";
import { AppContext } from "@/features/AppContext";
import Button from "@/components/Button/Button";
import { Location } from "@/types";
import {
  detectUserLocation,
  saveLocationToCookie,
  UserLocationService,
} from "@/utils/locationService";

interface ShareLocationProps {
  onLocationDetected?: (location: Location) => void;
  onLocationError?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * ShareLocation component requests user's location permission and updates context
 */
const ShareLocation = ({
  onLocationDetected,
  onLocationError,
  className = "",
  disabled = false,
  children,
}: ShareLocationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(AppContext);

  const handleShareLocation = async () => {
    if (disabled || isLoading || !context) return;

    setIsLoading(true);
    setError(null);

    try {
      // Try browser geolocation first
      const location = await detectUserLocation();

      if (location) {
        // Save to cookie
        saveLocationToCookie(location);

        // Add to context
        context.addLocation(location);

        // Notify parent component
        if (onLocationDetected) {
          onLocationDetected(location);
        }
      } else {
        throw new Error("Unable to determine location from coordinates");
      }
    } catch (geolocationError) {
      console.warn(
        "Geolocation failed, trying IP-based detection:",
        (geolocationError as Error).message
      );

      try {
        // Fallback to IP-based location detection
        const fallbackLocation = await UserLocationService();

        if (fallbackLocation) {
          // Save to cookie
          saveLocationToCookie(fallbackLocation);

          // Add to context
          context.addLocation(fallbackLocation);

          // Notify parent component
          if (onLocationDetected) {
            onLocationDetected(fallbackLocation);
          }
        } else {
          throw new Error("Unable to detect location using IP service");
        }
      } catch (fallbackError) {
        const errorMessage =
          "Unable to detect your location. Please try again or select a location manually.";
        setError(errorMessage);

        if (onLocationError) {
          onLocationError(new Error(errorMessage));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <Button
        type="button"
        onClick={handleShareLocation}
        disabled={disabled || isLoading}
        variant={isLoading ? "secondary" : "primary"}
        className="w-full flex items-center justify-center"
        aria-label={isLoading ? "Detecting location..." : "Share my location"}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            Detecting location...
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          </span>
        ) : (
          children || "Share My Location"
        )}
      </Button>

      {error && (
        <div
          className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded border-l-4 border-red-400 max-w-sm md:text-xs md:max-w-72"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ShareLocation;
