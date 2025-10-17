import { urlBigData } from "../../utils/utilities.js";
import {
  UserLocationService,
  matchesCity,
  getLocationId,
  createLocationObject,
} from "../../utils/getUserLocation.js";

/**
 * Gets user's geolocation and updates location context
 * @param {Array} locations - Array of available locations
 * @param {Function} setUserLocation - Function to set user location
 * @param {Function} addLocation - Function to add location to context
 * @param {Function} setHasCity - Function to set city availability status
 */
export const getGeoLocation = async (
  locations,
  setUserLocation,
  addLocation,
  setHasCity
) => {
  let location;

  if (navigator.geolocation) {
    location = navigator.geolocation.getCurrentPosition(
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
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {Array} locations - Array of available locations
 * @param {Function} setUserLocation - Function to set user location
 * @param {Function} addLocation - Function to add location to context
 * @param {Function} setHasCity - Function to set city availability status
 */
const handleGeolocationSuccess = async (
  latitude,
  longitude,
  locations,
  setUserLocation,
  addLocation,
  setHasCity
) => {
  const url = urlBigData(latitude, longitude);
  const locationResponse = await fetch(url);
  const locationData = await locationResponse.json();
  const { city, principalSubdivision: state } = locationData;

  setHasCity(matchesCity(city));

  const id = getLocationId(locations, city, state);
  const locationObject = createLocationObject(city, state, id);

  if (id) {
    setUserLocation(locationObject);
    addLocation(locationObject);
  }
};

/**
 * Handles geolocation errors by falling back to IP-based location
 * @param {GeolocationPositionError} error - Geolocation error object
 * @param {Function} setUserLocation - Function to set user location
 * @param {Function} addLocation - Function to add location to context
 * @param {Function} setHasCity - Function to set city availability status
 */
const handleGeolocationError = async (
  error,
  setUserLocation,
  addLocation,
  setHasCity
) => {
  if (error.PERMISSION_DENIED) {
    const location = await UserLocationService();
    setHasCity(matchesCity(location.city));
    setUserLocation(location);
    addLocation(location);
  }
};
