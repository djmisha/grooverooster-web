import { searchFilter, clearSearch } from "@/utils/searchFilter";
import { Event } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeEvent = (id: number, overrides: Partial<Event> = {}): Event => ({
  id,
  name: `Event ${id}`,
  date: "2024-06-15",
  formattedDate: "Saturday, June 15",
  venue: { name: `Venue ${id}` },
  artistlist: [{ name: `Artist ${id}` }],
  genres: [],
  isVisible: true,
  ...overrides,
});

// ---------------------------------------------------------------------------
// searchFilter – text search
// ---------------------------------------------------------------------------

describe("searchFilter – text search", () => {
  it("returns undefined when no events match", () => {
    const events = [makeEvent(1, { venue: { name: "Club Zero" } })];
    expect(searchFilter("nonexistent", events)).toBeUndefined();
  });

  it("matches events by venue name (case-insensitive)", () => {
    const events = [
      makeEvent(1, { venue: { name: "Venue Alpha" } }),
      makeEvent(2, { venue: { name: "Venue Beta" } }),
    ];
    const result = searchFilter("alpha", events);
    expect(result).toBeDefined();
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(false);
  });

  it("matches events by artist name", () => {
    const events = [
      makeEvent(1, { artistlist: [{ name: "DJ Shadow" }] }),
      makeEvent(2, { artistlist: [{ name: "Aphex Twin" }] }),
    ];
    const result = searchFilter("shadow", events);
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(false);
  });

  it("matches events by event name", () => {
    const events = [
      makeEvent(1, { name: "Summer Rave" }),
      makeEvent(2, { name: "Winter Dance" }),
    ];
    const result = searchFilter("summer", events);
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(false);
  });

  it("matches events by genre name", () => {
    const events = [
      makeEvent(1, {
        genres: [{ id: "1", name: "House", normalized_name: "house" }],
      }),
      makeEvent(2, {
        genres: [{ id: "2", name: "Techno", normalized_name: "techno" }],
      }),
    ];
    const result = searchFilter("house", events);
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(false);
  });

  it("matches events by formattedDate", () => {
    const events = [
      makeEvent(1, { formattedDate: "Saturday, June 15" }),
      makeEvent(2, { formattedDate: "Sunday, July 4" }),
    ];
    const result = searchFilter("June", events);
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(false);
  });

  it("handles pipe-separated display|filter format", () => {
    const events = [
      makeEvent(1, { venue: { name: "Club Alpha" } }),
      makeEvent(2, { venue: { name: "Club Beta" } }),
    ];
    // "Display Label|alpha" → uses "alpha" for filtering
    const result = searchFilter("Display Label|alpha", events);
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(false);
  });

  it("supports artistList (camelCase) field", () => {
    const event = {
      ...makeEvent(1),
      artistlist: undefined,
      artistList: [{ name: "Deadmau5" }],
    } as unknown as Event;
    const result = searchFilter("deadmau5", [event]);
    expect(result![0].isVisible).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// searchFilter – date filter
// ---------------------------------------------------------------------------

describe("searchFilter – date filter", () => {
  it("matches events on the exact date", () => {
    const events = [
      makeEvent(1, { date: "2024-06-15" }),
      makeEvent(2, { date: "2024-06-16" }),
    ];
    const result = searchFilter("date:2024-06-15", events);
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(false);
  });

  it("returns undefined when no events match the date", () => {
    const events = [makeEvent(1, { date: "2024-06-15" })];
    expect(searchFilter("date:2024-12-31", events)).toBeUndefined();
  });

  it("skips events without a date field", () => {
    const events = [makeEvent(1, { date: undefined as unknown as string })];
    expect(searchFilter("date:2024-06-15", events)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// searchFilter – date range filter
// ---------------------------------------------------------------------------

describe("searchFilter – date range filter", () => {
  it("matches events within the date range (inclusive)", () => {
    const events = [
      makeEvent(1, { date: "2024-06-10" }),
      makeEvent(2, { date: "2024-06-15" }),
      makeEvent(3, { date: "2024-06-20" }),
      makeEvent(4, { date: "2024-07-01" }),
    ];
    const result = searchFilter("daterange:2024-06-12:2024-06-22", events);
    expect(result!.find((e) => e.id === 1)?.isVisible).toBe(false);
    expect(result!.find((e) => e.id === 2)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 3)?.isVisible).toBe(true);
    expect(result!.find((e) => e.id === 4)?.isVisible).toBe(false);
  });

  it("returns undefined when no events fall within the range", () => {
    const events = [makeEvent(1, { date: "2024-01-01" })];
    expect(
      searchFilter("daterange:2024-06-01:2024-06-30", events)
    ).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// clearSearch
// ---------------------------------------------------------------------------

describe("clearSearch", () => {
  it("sets all events to visible", () => {
    const events: Event[] = [
      makeEvent(1, { isVisible: false }),
      makeEvent(2, { isVisible: false }),
    ];
    const result = clearSearch(events);
    expect(result.every((e) => e.isVisible)).toBe(true);
  });

  it("does not change already-visible events", () => {
    const events: Event[] = [makeEvent(1, { isVisible: true })];
    const result = clearSearch(events);
    expect(result[0].isVisible).toBe(true);
  });

  it("returns the same array reference", () => {
    const events: Event[] = [makeEvent(1)];
    const result = clearSearch(events);
    expect(result).toBe(events);
  });
});
