import setDates from "./setDates";
import { Event } from "@/types";

// Legacy event format from EDM Train API
interface LegacyEvent {
  id: string | number;
  link?: string;
  name: string;
  ages?: string;
  festivalInd?: boolean;
  livestreamInd?: boolean;
  electronicGenreInd?: boolean;
  otherGenreInd?: boolean;
  date: string;
  startTime?: string;
  endTime?: string;
  createdDate?: string;
  venue?: {
    id?: string | number;
    name: string;
    location?: string;
    address?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  artistList?: Array<{
    id?: string | number;
    name: string;
    link?: string;
    b2bInd?: boolean;
  }>;
  eventSource?: string;
}

/**
 * Transform event data from the EDM Train (legacy) API format to the new SDHM format
 * This is the REVERSE of the old eventTransformer - it converts OLD format to NEW format
 */
export function transformEDMTrainEventData(
  legacyEvent: LegacyEvent | null
): Event | null {
  if (!legacyEvent) return null;

  // Handle artist list - if no artists and has event name, use event name as artist and blank event name
  let artistList =
    legacyEvent.artistList?.map((artist) => ({
      id: artist.id,
      name: artist.name,
      link: artist.link,
      b2bInd: artist.b2bInd,
    })) || [];

  let eventName = legacyEvent.name;

  if (artistList.length === 0 && eventName) {
    // If no artists listed, move event name to artist field and blank out event name
    artistList = [
      {
        id: undefined,
        name: eventName,
        link: undefined,
        b2bInd: undefined,
      },
    ];
    eventName = "";
  }

  return {
    id: legacyEvent.id,
    link: legacyEvent.link,
    name: eventName,
    ages: legacyEvent.ages,
    festivalind: legacyEvent.festivalInd,
    livestreamind: legacyEvent.livestreamInd,
    electronicgenreind: legacyEvent.electronicGenreInd,
    othergenreind: legacyEvent.otherGenreInd,
    date: legacyEvent.date,
    starttime: legacyEvent.startTime,
    endtime: legacyEvent.endTime,
    createddate: legacyEvent.createdDate,
    venue: {
      id: legacyEvent.venue?.id,
      name: legacyEvent.venue?.name || "",
      location: legacyEvent.venue?.location,
      address: legacyEvent.venue?.address,
      state: legacyEvent.venue?.state,
      country: legacyEvent.venue?.country,
      latitude: legacyEvent.venue?.latitude,
      longitude: legacyEvent.venue?.longitude,
    },
    artistlist: artistList,
    source: legacyEvent.eventSource,
    isVisible: true,
    formattedDate: legacyEvent.date
      ? setDates(legacyEvent.date).dayMonthYear
      : undefined,
  } as Event;
}

/**
 * Transform an array of events from EDM Train (legacy) format to new SDHM format
 */
export function transformEDMTrainEventsArray(
  legacyEvents: LegacyEvent[]
): Event[] {
  if (!Array.isArray(legacyEvents)) return [];

  return legacyEvents
    .map(transformEDMTrainEventData)
    .filter(Boolean) as Event[];
}
