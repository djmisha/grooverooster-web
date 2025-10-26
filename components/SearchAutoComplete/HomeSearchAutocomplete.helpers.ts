import { allArtists } from "../../utils/getArtists";
import locations from "../../utils/locations.json";
import { Location, SearchItem } from "@/types";

interface ArtistLike {
  id: string | number | undefined;
  name: string;
}

export const formatDataforSearch = (): SearchItem[] => {
  const cleanData: SearchItem[] = [];

  mutateData(locations as Location[], allArtists as ArtistLike[], cleanData);

  return cleanData;
};

const mutateData = (
  locations: Location[],
  allArtists: ArtistLike[],
  cleanData: SearchItem[]
) => {
  locations &&
    locations.map((item) => {
      const { id, city, state } = item;
      if (city) cleanData.push(createObject(id, city, "City"));
      else cleanData.push(createObject(id, state, "State"));
    });

  allArtists &&
    allArtists.map((item) => {
      const { id, name } = item;
      if (id) cleanData.push(createObject(id, name, "Artist"));
    });
};

const createObject = (
  id: string | number,
  name: string,
  type: string
): SearchItem => {
  return {
    id,
    name,
    type,
  };
};
