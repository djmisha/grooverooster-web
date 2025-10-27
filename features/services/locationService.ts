import { urlBigData } from "../../utils/utilities";
import {
  UserLocationService,
  matchesCity,
  getLocationId,
  createLocationObject,
} from "../../utils/getUserLocation";
import { Location } from "@/types";

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

  setHasCity(matchesCity(city));

  const id = getLocationId(locations, city, state);
  const locationObject = createLocationObject(city, state, id);

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
      setHasCity(matchesCity(location.city));
      setUserLocation(location);
      addLocation(location);
    }
  }
};
