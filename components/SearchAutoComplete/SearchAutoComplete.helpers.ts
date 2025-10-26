import { Event, Artist, Venue } from "@/types";

interface SearchItem {
  id: string | number;
  name: string;
  type: string;
}

export const formatDataforSearch = (data: Event[]): SearchItem[] => {
  const cleanData: SearchItem[] = [];
  const venues: SearchItem[] = [];
  const artists: SearchItem[] = [];

  mutateData(data, cleanData, venues, artists);

  return cleanData;
};

const mutateData = (
  data: Event[],
  cleanData: SearchItem[],
  venues: SearchItem[],
  artists: SearchItem[]
) => {
  data &&
    data.map((item) => {
      const { artistList, venue } = item;

      cleanData.push(createObject(item, "Event"));

      artistList?.map((artist) => {
        artists.push(createObject(artist, "Artist"));
      });

      venues.push(createObject(venue, "Venue"));
    });

  const cleanVenues = dedupeObjArray(venues);
  cleanVenues.map((item) => cleanData.push(item));

  const cleanArtists = dedupeObjArray(artists);
  cleanArtists.map((item) => cleanData.push(item));
};

const createObject = (
  item: Event | Artist | Venue,
  type: string
): SearchItem => {
  const { id, name } = item;
  return {
    id: id || 0,
    name,
    type,
  };
};

const dedupeObjArray = (array: SearchItem[]): SearchItem[] => {
  const unique = array.reduce((accumulator: SearchItem[], current) => {
    if (!accumulator.find((item) => item.id === current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return unique;
};
