import { urlBigData } from "@/utils/utilities";
import {
  UserLocationService,
  getLocationId,
  createLocationObject,
} from "@/utils/locationService";
import locations from "@/utils/locations.json";
import { Location } from "@/types";

// Helper function to check if city matches a city in the locations list
const matchesCity = (city: string, locationsList: any[]): boolean => {
  return locationsList.some((location) => location.city === city);
};

/**
 * Gets user's geolocation and updates location context
 */
export const getGeoLocation = async (
  locations: Location[],
  setUserLocation: (location: Location) => void,
  addLocation: (location: Location) => void,
  setHasCity: (hasCity: boolean) => void
) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        await handleGeolocationSuccess(
          latitude,
          longitude,
          locations,
          setUserLocation,
          addLocation,
          setHasCity
        );
      },
      (error) =>
        handleGeolocationError(error, setUserLocation, addLocation, setHasCity)
    );
  }
};

/**
 * Handles successful geolocation retrieval
 */
const handleGeolocationSuccess = async (
  latitude: number,
  longitude: number,
  locations: Location[],
  setUserLocation: (location: Location) => void,
  addLocation: (location: Location) => void,
  setHasCity: (hasCity: boolean) => void
) => {
  const url = urlBigData(latitude, longitude);
  const locationResponse = await fetch(url);
  const locationData = await locationResponse.json();
  const { city, principalSubdivision: state } = locationData;

  setHasCity(matchesCity(city, locations));

  const id = getLocationId(locations, city, state);
  
  // Create location object with the data we have
  const foundLocation = locations.find((loc: any) => loc.id === id);
  const locationObject = foundLocation ? createLocationObject(foundLocation) : null;

  if (id && locationObject) {
    setUserLocation(locationObject);
    addLocation(locationObject);
  }
};

/**
 * Handles geolocation errors by falling back to IP-based location
 */
const handleGeolocationError = async (
  error: GeolocationPositionError,
  setUserLocation: (location: Location) => void,
  addLocation: (location: Location) => void,
  setHasCity: (hasCity: boolean) => void
) => {
  if (error.PERMISSION_DENIED) {
    const location = await UserLocationService();
    if (location && location.city) {
      setHasCity(matchesCity(location.city, locations as any));
      setUserLocation(location);
      addLocation(location);
    }
  }
};
