import {
  numericIdSchema,
  cityNameSchema,
  artistNameSchema,
  uuidSchema,
  artistSchema,
  topArtistSchema,
  tagSchema,
  saveTagsBodySchema,
  validateData,
  formatValidationError,
} from "@/lib/validation/schemas";
import { z } from "zod";

// ---------------------------------------------------------------------------
// numericIdSchema
// ---------------------------------------------------------------------------

describe("numericIdSchema", () => {
  it("accepts a numeric string", () => {
    expect(numericIdSchema.safeParse("123").success).toBe(true);
  });

  it("accepts single digit", () => {
    expect(numericIdSchema.safeParse("0").success).toBe(true);
  });

  it("rejects letters", () => {
    expect(numericIdSchema.safeParse("abc").success).toBe(false);
  });

  it("rejects alphanumeric mix", () => {
    expect(numericIdSchema.safeParse("12abc").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(numericIdSchema.safeParse("").success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// cityNameSchema
// ---------------------------------------------------------------------------

describe("cityNameSchema", () => {
  it("accepts a simple city name", () => {
    expect(cityNameSchema.safeParse("San Diego").success).toBe(true);
  });

  it("accepts a hyphenated city name", () => {
    expect(cityNameSchema.safeParse("Winston-Salem").success).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(cityNameSchema.safeParse("").success).toBe(false);
  });

  it("rejects names with digits", () => {
    expect(cityNameSchema.safeParse("City123").success).toBe(false);
  });

  it("rejects names with special characters beyond hyphen", () => {
    expect(cityNameSchema.safeParse("City@Place").success).toBe(false);
  });

  it("rejects strings exceeding 100 characters", () => {
    const longName = "a".repeat(101);
    expect(cityNameSchema.safeParse(longName).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// artistNameSchema
// ---------------------------------------------------------------------------

describe("artistNameSchema", () => {
  it("accepts a regular artist name", () => {
    expect(artistNameSchema.safeParse("DJ Shadow").success).toBe(true);
  });

  it("accepts special characters in artist names", () => {
    expect(artistNameSchema.safeParse("Aphex Twin & Friends").success).toBe(
      true
    );
  });

  it("rejects an empty string", () => {
    expect(artistNameSchema.safeParse("").success).toBe(false);
  });

  it("rejects names exceeding 255 characters", () => {
    const longName = "a".repeat(256);
    expect(artistNameSchema.safeParse(longName).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// uuidSchema
// ---------------------------------------------------------------------------

describe("uuidSchema", () => {
  it("accepts a valid UUID", () => {
    expect(
      uuidSchema.safeParse("550e8400-e29b-41d4-a716-446655440000").success
    ).toBe(true);
  });

  it("rejects an invalid UUID", () => {
    expect(uuidSchema.safeParse("not-a-uuid").success).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(uuidSchema.safeParse("").success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// artistSchema
// ---------------------------------------------------------------------------

describe("artistSchema", () => {
  it("accepts a minimal valid artist", () => {
    expect(artistSchema.safeParse({ name: "DJ Shadow" }).success).toBe(true);
  });

  it("accepts a full artist object", () => {
    const artist = {
      id: 1,
      name: "DJ Shadow",
      image: "https://example.com/img.jpg",
      bio: "Bio text",
      tags: ["electronic", "hip-hop"],
    };
    expect(artistSchema.safeParse(artist).success).toBe(true);
  });

  it("rejects an artist with an empty name", () => {
    expect(artistSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejects an artist with a non-URL image", () => {
    expect(
      artistSchema.safeParse({ name: "DJ", image: "not-a-url" }).success
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// topArtistSchema
// ---------------------------------------------------------------------------

describe("topArtistSchema", () => {
  it("accepts a valid top artist", () => {
    const topArtist = { name: "Deadmau5", rank: 1, count: 10 };
    expect(topArtistSchema.safeParse(topArtist).success).toBe(true);
  });

  it("rejects negative rank", () => {
    expect(
      topArtistSchema.safeParse({ name: "Artist", rank: -1 }).success
    ).toBe(false);
  });

  it("rejects negative count", () => {
    expect(
      topArtistSchema.safeParse({ name: "Artist", count: -5 }).success
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// tagSchema
// ---------------------------------------------------------------------------

describe("tagSchema", () => {
  it("accepts a valid tag", () => {
    expect(tagSchema.safeParse({ name: "house" }).success).toBe(true);
  });

  it("rejects an empty tag name", () => {
    expect(tagSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejects a tag name exceeding 100 characters", () => {
    expect(tagSchema.safeParse({ name: "a".repeat(101) }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// saveTagsBodySchema
// ---------------------------------------------------------------------------

describe("saveTagsBodySchema", () => {
  it("accepts a valid tags array", () => {
    expect(
      saveTagsBodySchema.safeParse({ tags: [{ name: "house" }] }).success
    ).toBe(true);
  });

  it("rejects an empty tags array", () => {
    expect(saveTagsBodySchema.safeParse({ tags: [] }).success).toBe(false);
  });

  it("rejects when tags field is missing", () => {
    expect(saveTagsBodySchema.safeParse({}).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validateData helper
// ---------------------------------------------------------------------------

describe("validateData", () => {
  it("returns success and data for valid input", () => {
    const result = validateData(numericIdSchema, "123");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("123");
    }
  });

  it("returns failure and error for invalid input", () => {
    const result = validateData(numericIdSchema, "abc");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});

// ---------------------------------------------------------------------------
// formatValidationError helper
// ---------------------------------------------------------------------------

describe("formatValidationError", () => {
  it("formats a single error message without path", () => {
    const result = numericIdSchema.safeParse("abc");
    if (!result.success) {
      const message = formatValidationError(result.error);
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
    }
  });

  it("formats errors with path prefix", () => {
    const schema = z.object({ id: numericIdSchema });
    const result = schema.safeParse({ id: "abc" });
    if (!result.success) {
      const message = formatValidationError(result.error);
      expect(message).toContain("id:");
    }
  });

  it("joins multiple errors with a comma", () => {
    const schema = z.object({
      id: numericIdSchema,
      city: cityNameSchema,
    });
    const result = schema.safeParse({ id: "abc", city: "" });
    if (!result.success) {
      const message = formatValidationError(result.error);
      expect(message).toContain(",");
    }
  });
});
