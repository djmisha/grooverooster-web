import {
  transformEDMTrainEventData,
  transformEDMTrainEventsArray,
} from "@/utils/edmTrainTransformer";

// ---------------------------------------------------------------------------
// transformEDMTrainEventData
// ---------------------------------------------------------------------------

describe("transformEDMTrainEventData", () => {
  const legacyEvent = {
    id: 42,
    link: "https://example.com/event",
    name: "Techno Night",
    ages: "21+",
    festivalInd: false,
    livestreamInd: false,
    electronicGenreInd: true,
    otherGenreInd: false,
    date: "2024-06-15",
    startTime: "22:00",
    endTime: "04:00",
    createdDate: "2024-01-01",
    venue: {
      id: 10,
      name: "Club Underground",
      location: "San Diego, CA",
      address: "123 Main St",
      state: "CA",
      country: "US",
      latitude: 32.7157,
      longitude: -117.1611,
    },
    artistList: [
      { id: 1, name: "DJ Shadow", link: "https://djshadow.com", b2bInd: false },
      { id: 2, name: "Aphex Twin", link: undefined, b2bInd: true },
    ],
    eventSource: "edmtrain",
  };

  it("returns null for null input", () => {
    expect(transformEDMTrainEventData(null)).toBeNull();
  });

  it("maps top-level fields correctly", () => {
    const result = transformEDMTrainEventData(legacyEvent)!;
    expect(result.id).toBe(42);
    expect(result.link).toBe("https://example.com/event");
    expect(result.name).toBe("Techno Night");
    expect(result.ages).toBe("21+");
    expect(result.date).toBe("2024-06-15");
    expect(result.starttime).toBe("22:00");
    expect(result.endtime).toBe("04:00");
    expect(result.source).toBe("edmtrain");
    expect(result.isVisible).toBe(true);
  });

  it("converts camelCase flags to lowercase indicator fields", () => {
    const result = transformEDMTrainEventData(legacyEvent)!;
    expect(result.festivalind).toBe(false);
    expect(result.livestreamind).toBe(false);
    expect(result.electronicgenreind).toBe(true);
    expect(result.othergenreind).toBe(false);
  });

  it("maps venue fields correctly", () => {
    const result = transformEDMTrainEventData(legacyEvent)!;
    expect(result.venue.id).toBe(10);
    expect(result.venue.name).toBe("Club Underground");
    expect(result.venue.address).toBe("123 Main St");
    expect(result.venue.state).toBe("CA");
    expect(result.venue.country).toBe("US");
    expect(result.venue.latitude).toBe(32.7157);
    expect(result.venue.longitude).toBe(-117.1611);
  });

  it("maps artist list fields correctly", () => {
    const result = transformEDMTrainEventData(legacyEvent)!;
    expect(result.artistlist).toHaveLength(2);
    expect(result.artistlist![0].name).toBe("DJ Shadow");
    expect(result.artistlist![1].name).toBe("Aphex Twin");
    expect(result.artistlist![1].b2bInd).toBe(true);
  });

  it("generates a formattedDate from the date field", () => {
    const result = transformEDMTrainEventData(legacyEvent)!;
    expect(result.formattedDate).toBeDefined();
    expect(typeof result.formattedDate).toBe("string");
    expect(result.formattedDate!.length).toBeGreaterThan(0);
  });

  it("leaves formattedDate undefined when no date provided", () => {
    const result = transformEDMTrainEventData({ ...legacyEvent, date: "" })!;
    expect(result.formattedDate).toBeUndefined();
  });

  it("uses empty string venue name when venue is absent", () => {
    const result = transformEDMTrainEventData({
      ...legacyEvent,
      venue: undefined,
    })!;
    expect(result.venue.name).toBe("");
  });

  it("moves event name to artist when artistList is empty", () => {
    const noArtistEvent = { ...legacyEvent, artistList: [], name: "Solo Show" };
    const result = transformEDMTrainEventData(noArtistEvent)!;
    expect(result.artistlist).toHaveLength(1);
    expect(result.artistlist![0].name).toBe("Solo Show");
    expect(result.name).toBe("");
  });

  it("moves event name to artist when artistList is undefined", () => {
    const { artistList: _omitted, ...rest } = legacyEvent as any;
    const result = transformEDMTrainEventData({ ...rest, name: "Solo Show" })!;
    expect(result.artistlist![0].name).toBe("Solo Show");
    expect(result.name).toBe("");
  });
});

// ---------------------------------------------------------------------------
// transformEDMTrainEventsArray
// ---------------------------------------------------------------------------

describe("transformEDMTrainEventsArray", () => {
  it("returns empty array for empty input", () => {
    expect(transformEDMTrainEventsArray([])).toEqual([]);
  });

  it("returns empty array for non-array input", () => {
    expect(transformEDMTrainEventsArray(null as any)).toEqual([]);
  });

  it("transforms all events in the array", () => {
    const events = [
      {
        id: 1,
        name: "Event One",
        date: "2024-06-01",
        venue: { name: "Venue A" },
        artistList: [{ name: "DJ One" }],
      },
      {
        id: 2,
        name: "Event Two",
        date: "2024-06-02",
        venue: { name: "Venue B" },
        artistList: [{ name: "DJ Two" }],
      },
    ];
    const result = transformEDMTrainEventsArray(events);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it("filters out null results from the array", () => {
    // Force one item to produce null by passing a null element
    const events = [
      null as any,
      {
        id: 1,
        name: "Valid",
        date: "2024-06-01",
        venue: { name: "V" },
        artistList: [],
      },
    ];
    const result = transformEDMTrainEventsArray(events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});
