import {
  cleanString,
  removeDuplicates,
  makeVenues,
  makeDates,
  makeArtists,
  makeGenres,
  cityOrState,
  makePageTitle,
  makePageHeadline,
  makePageDescription,
  ToSlugArtist,
  filterSurpriseGuest,
  makeSeries,
  makeVenuesWithCounts,
  makeGenresWithCounts,
  makeArtistsWithCounts,
  makeFestivals,
  makeFestivalsWithCounts,
  makeSeriesWithCounts,
} from "@/utils/utilities";
import { Event, Artist } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 1,
  name: "Test Event",
  date: "2024-06-15",
  formattedDate: "Saturday, June 15",
  venue: { name: "Test Venue" },
  artistlist: [{ name: "DJ One" }, { name: "DJ Two" }],
  genres: [{ id: "1", name: "House", normalized_name: "house" }],
  isVisible: true,
  ...overrides,
});

// ---------------------------------------------------------------------------
// cleanString
// ---------------------------------------------------------------------------

describe("cleanString", () => {
  it("removes HTML-encoded ampersands", () => {
    expect(cleanString("Rock &amp; Roll")).toBe("Rock  Roll");
  });

  it("removes special characters", () => {
    expect(cleanString("Hello, World!")).toBe("Hello World");
  });

  it("preserves letters, numbers, and spaces", () => {
    expect(cleanString("abc 123 XYZ")).toBe("abc 123 XYZ");
  });

  it("returns empty string for empty input", () => {
    expect(cleanString("")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// removeDuplicates
// ---------------------------------------------------------------------------

describe("removeDuplicates", () => {
  it("removes duplicate strings", () => {
    expect(removeDuplicates(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("returns same array when there are no duplicates", () => {
    expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("returns empty array for empty input", () => {
    expect(removeDuplicates([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// makeVenues
// ---------------------------------------------------------------------------

describe("makeVenues", () => {
  it("extracts unique venue names sorted alphabetically", () => {
    const events = [
      makeEvent({ id: 1, venue: { name: "Club Z" } }),
      makeEvent({ id: 2, venue: { name: "Arena A" } }),
      makeEvent({ id: 3, venue: { name: "Club Z" } }),
    ];
    expect(makeVenues(events)).toEqual(["Arena A", "Club Z"]);
  });

  it("returns empty array for empty input", () => {
    expect(makeVenues([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// makeDates
// ---------------------------------------------------------------------------

describe("makeDates", () => {
  it("extracts formatted dates in chronological order", () => {
    const events = [
      makeEvent({ date: "2024-06-20", formattedDate: "Thursday, June 20" }),
      makeEvent({ date: "2024-06-15", formattedDate: "Saturday, June 15" }),
    ];
    const result = makeDates(events);
    expect(result[0]).toBe("Saturday, June 15");
    expect(result[1]).toBe("Thursday, June 20");
  });

  it("returns empty array for empty input", () => {
    expect(makeDates([])).toEqual([]);
  });

  it("skips events without formattedDate or date", () => {
    const events = [
      makeEvent({
        date: undefined as unknown as string,
        formattedDate: undefined,
      }),
    ];
    expect(makeDates(events)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// makeArtists
// ---------------------------------------------------------------------------

describe("makeArtists", () => {
  it("extracts unique artist names across events", () => {
    const events = [
      makeEvent({ artistlist: [{ name: "DJ One" }, { name: "DJ Two" }] }),
      makeEvent({ artistlist: [{ name: "DJ Two" }, { name: "DJ Three" }] }),
    ];
    const result = makeArtists(events);
    expect(result).toContain("DJ One");
    expect(result).toContain("DJ Two");
    expect(result).toContain("DJ Three");
    expect(result.filter((a) => a === "DJ Two")).toHaveLength(1);
  });

  it("returns empty array for events with no artists", () => {
    expect(makeArtists([makeEvent({ artistlist: [] })])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// makeGenres
// ---------------------------------------------------------------------------

describe("makeGenres", () => {
  it("extracts unique genre names sorted alphabetically", () => {
    const events = [
      makeEvent({
        genres: [
          { id: "1", name: "Techno", normalized_name: "techno" },
          { id: "2", name: "House", normalized_name: "house" },
        ],
      }),
      makeEvent({
        genres: [{ id: "2", name: "House", normalized_name: "house" }],
      }),
    ];
    expect(makeGenres(events)).toEqual(["House", "Techno"]);
  });

  it("returns empty array when no genres present", () => {
    expect(makeGenres([makeEvent({ genres: [] })])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// cityOrState
// ---------------------------------------------------------------------------

describe("cityOrState", () => {
  it("returns 'City, State' when city is provided", () => {
    expect(cityOrState("San Diego", "CA")).toBe("San Diego, CA");
  });

  it("returns only state when city is undefined", () => {
    expect(cityOrState(undefined, "CA")).toBe("CA");
  });
});

// ---------------------------------------------------------------------------
// makePageTitle / makePageHeadline / makePageDescription
// ---------------------------------------------------------------------------

describe("makePageTitle", () => {
  it("includes city and state in the title", () => {
    const title = makePageTitle("San Diego", "CA");
    expect(title).toContain("San Diego, CA");
  });

  it("works with state only", () => {
    const title = makePageTitle(undefined, "TX");
    expect(title).toContain("TX");
    expect(title).not.toContain("undefined");
  });
});

describe("makePageHeadline", () => {
  it("includes location in headline", () => {
    expect(makePageHeadline("Miami", "FL")).toContain("Miami, FL");
  });
});

describe("makePageDescription", () => {
  it("includes location in description", () => {
    const desc = makePageDescription("Chicago", "IL");
    expect(desc).toContain("Chicago, IL");
  });
});

// ---------------------------------------------------------------------------
// ToSlugArtist
// ---------------------------------------------------------------------------

describe("ToSlugArtist", () => {
  it("converts a name to a lowercase hyphenated slug", () => {
    expect(ToSlugArtist("DJ Shadow")).toBe("dj-shadow");
  });

  it("removes consecutive hyphens", () => {
    expect(ToSlugArtist("deadmau5")).toBe("deadmau5");
  });

  it("returns 'undefined' for undefined input", () => {
    expect(ToSlugArtist(undefined)).toBe("undefined");
  });

  it("strips leading and trailing hyphens", () => {
    const result = ToSlugArtist("!Test Artist!");
    expect(result).not.toMatch(/^-|-$/);
  });

  it("normalizes accented characters", () => {
    const result = ToSlugArtist("Röyksopp");
    expect(result).toBe("royksopp");
  });
});

// ---------------------------------------------------------------------------
// filterSurpriseGuest
// ---------------------------------------------------------------------------

describe("filterSurpriseGuest", () => {
  const artists: Artist[] = [
    { name: "DJ Real" },
    { name: "Surprise Guest" },
    { name: "TBD" },
    { name: "TBA" },
    { name: "Special Guest" },
    { name: "Another Artist" },
  ];

  it("removes placeholder artist names", () => {
    const result = filterSurpriseGuest(artists);
    expect(result.map((a) => a.name)).toEqual(["DJ Real", "Another Artist"]);
  });

  it("returns all artists when no placeholder names present", () => {
    const real: Artist[] = [{ name: "Artist A" }, { name: "Artist B" }];
    expect(filterSurpriseGuest(real)).toHaveLength(2);
  });

  it("returns empty array for empty input", () => {
    expect(filterSurpriseGuest([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// makeSeries
// ---------------------------------------------------------------------------

describe("makeSeries", () => {
  it("returns event names that appear more than once", () => {
    const events = [
      makeEvent({ id: 1, name: "Weekly Rave" }),
      makeEvent({ id: 2, name: "Weekly Rave" }),
      makeEvent({ id: 3, name: "One-Off Show" }),
    ];
    expect(makeSeries(events)).toContain("Weekly Rave");
    expect(makeSeries(events)).not.toContain("One-Off Show");
  });

  it("returns empty array when no recurring events", () => {
    const events = [
      makeEvent({ id: 1, name: "Show A" }),
      makeEvent({ id: 2, name: "Show B" }),
    ];
    expect(makeSeries(events)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// makeVenuesWithCounts
// ---------------------------------------------------------------------------

describe("makeVenuesWithCounts", () => {
  it("returns venues with correct event counts", () => {
    const events = [
      makeEvent({ id: 1, venue: { name: "Club A" } }),
      makeEvent({ id: 2, venue: { name: "Club A" } }),
      makeEvent({ id: 3, venue: { name: "Club B" } }),
    ];
    const result = makeVenuesWithCounts(events);
    expect(result.find((v) => v.name === "Club A")?.count).toBe(2);
    expect(result.find((v) => v.name === "Club B")?.count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// makeGenresWithCounts
// ---------------------------------------------------------------------------

describe("makeGenresWithCounts", () => {
  it("returns genres with correct event counts", () => {
    const events = [
      makeEvent({
        id: 1,
        genres: [{ id: "1", name: "House", normalized_name: "house" }],
      }),
      makeEvent({
        id: 2,
        genres: [{ id: "1", name: "House", normalized_name: "house" }],
      }),
      makeEvent({
        id: 3,
        genres: [{ id: "2", name: "Techno", normalized_name: "techno" }],
      }),
    ];
    const result = makeGenresWithCounts(events);
    expect(result.find((g) => g.name === "House")?.count).toBe(2);
    expect(result.find((g) => g.name === "Techno")?.count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// makeArtistsWithCounts
// ---------------------------------------------------------------------------

describe("makeArtistsWithCounts", () => {
  it("returns artists with correct appearance counts", () => {
    const events = [
      makeEvent({ id: 1, artistlist: [{ name: "DJ One" }] }),
      makeEvent({
        id: 2,
        artistlist: [{ name: "DJ One" }, { name: "DJ Two" }],
      }),
    ];
    const result = makeArtistsWithCounts(events);
    expect(result.find((a) => a.name === "DJ One")?.count).toBe(2);
    expect(result.find((a) => a.name === "DJ Two")?.count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// makeFestivals / makeFestivalsWithCounts
// ---------------------------------------------------------------------------

describe("makeFestivals", () => {
  it("returns only festival event names", () => {
    const events = [
      makeEvent({ id: 1, name: "Big Festival", festivalind: true }),
      makeEvent({ id: 2, name: "Club Night", festivalind: false }),
      makeEvent({ id: 3, name: "Another Festival", festivalInd: true }),
    ];
    const result = makeFestivals(events);
    expect(result).toContain("Big Festival");
    expect(result).toContain("Another Festival");
    expect(result).not.toContain("Club Night");
  });
});

describe("makeFestivalsWithCounts", () => {
  it("returns festival counts correctly", () => {
    const events = [
      makeEvent({ id: 1, name: "Coachella", festivalind: true }),
      makeEvent({ id: 2, name: "Coachella", festivalind: true }),
      makeEvent({ id: 3, name: "Other Fest", festivalind: true }),
    ];
    const result = makeFestivalsWithCounts(events);
    expect(result.find((f) => f.name === "Coachella")?.count).toBe(2);
    expect(result.find((f) => f.name === "Other Fest")?.count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// makeSeriesWithCounts
// ---------------------------------------------------------------------------

describe("makeSeriesWithCounts", () => {
  it("includes only recurring events with counts", () => {
    const events = [
      makeEvent({ id: 1, name: "Recurring" }),
      makeEvent({ id: 2, name: "Recurring" }),
      makeEvent({ id: 3, name: "Recurring" }),
      makeEvent({ id: 4, name: "One-Off" }),
    ];
    const result = makeSeriesWithCounts(events);
    expect(result.find((s) => s.name === "Recurring")?.count).toBe(3);
    expect(result.find((s) => s.name === "One-Off")).toBeUndefined();
  });
});
