import locations from "@/utils/locations.json";
import { Location } from "@/types";

interface IPData {
  ip: string;
}

interface LocationData {
  city: string;
  region_code: string;
}

interface LocationEntry {
  id: string | number;
  city?: string;
  state: string;
  stateCode?: string;
}

/**
 * Services to retrieve the location based on user IP
 * IP -> Location -> Match to Location ID -> return location object
 */
export const UserLocationService = async (): Promise<Location | undefined> => {
  try {
    const url = "https://api.ipify.org?format=json";
    const response = await fetch(url);
    const jsonData: IPData = await response.json();

    const ip = jsonData.ip;
    const locationURL = `https://ipapi.co/${ip}/json/`;
    const locationResponse = await fetch(locationURL);
    const locationData: LocationData = await locationResponse.json();
    const { city, region_code: state } = locationData;

    const id = getLocationId(locations as LocationEntry[], city, state);
    const locationObject = createLocationObject(city, state, id);

    if (id) return locationObject;
    return undefined;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getLocationId = (
  locations: LocationEntry[],
  city: string,
  state: string
): string | number | undefined => {
  let id: string | number | undefined;

  locations.forEach(function (location) {
    if (city === location.city) {
      id = location.id;
    }
    if (!id && state === location.stateCode) {
      id = location.id;
    }
  });

  return id;
};

export const createLocationObject = (
  city: string,
  state: string,
  id: string | number | undefined
): Location | undefined => {
  if (!id) return undefined;

  let stateName = state;

  (locations as LocationEntry[]).find((location) => {
    if (location.id === id) {
      stateName = location.state;
      return true;
    }
    return false;
  });

  return {
    city,
    state: stateName,
    id,
  };
};

// check if city matches a city in the locations.json
export const matchesCity = (city: string): boolean => {
  let hasCity = false;
  (locations as LocationEntry[]).forEach((location) => {
    if (location.city === city) hasCity = true;
  });

  return hasCity;
};
