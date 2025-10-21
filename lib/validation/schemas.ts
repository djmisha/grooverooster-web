import { z } from "zod";

/**
 * Centralized Zod schemas for API endpoint validation
 * This ensures consistent input validation across all routes
 */

// ============================================================================
// Common/Shared Schemas
// ============================================================================

/**
 * Schema for validating numeric IDs from route parameters
 */
export const numericIdSchema = z.string().regex(/^\d+$/, {
  message: "ID must be a numeric string",
});

/**
 * Schema for validating city names from route parameters
 */
export const cityNameSchema = z
  .string()
  .min(1, "City name cannot be empty")
  .max(100, "City name is too long")
  .regex(/^[a-zA-Z\s\-]+$/, {
    message: "City name can only contain letters, spaces, and hyphens",
  });

/**
 * Schema for validating artist names from route parameters
 */
export const artistNameSchema = z
  .string()
  .min(1, "Artist name cannot be empty")
  .max(255, "Artist name is too long");

/**
 * Schema for validating UUIDs
 */
export const uuidSchema = z.string().uuid("Invalid UUID format");

// ============================================================================
// SDHM API Endpoint Schemas
// ============================================================================

/**
 * Schema for SDHM route parameters: /api/sdhm/[id]/[city]
 */
export const sdhmParamsSchema = z.object({
  params: z.tuple([numericIdSchema, cityNameSchema]),
});

// ============================================================================
// Events API Endpoint Schemas
// ============================================================================

/**
 * Schema for events route parameters: /api/events/[id]
 */
export const eventsIdParamsSchema = z.object({
  id: numericIdSchema,
});

/**
 * Schema for frontend events route parameters: /api/frontend/events/[locationId]/[city]
 */
export const frontendEventsParamsSchema = z.object({
  params: z.tuple([numericIdSchema, cityNameSchema]),
});

// ============================================================================
// Artists API Endpoint Schemas
// ============================================================================

/**
 * Schema for artists route parameters: /api/artists/[id]
 */
export const artistsIdParamsSchema = z.object({
  id: numericIdSchema,
});

// ============================================================================
// Last.fm API Endpoint Schemas
// ============================================================================

/**
 * Schema for Last.fm artist route parameters: /api/lastfm/artistgetinfo/[artist]
 */
export const lastfmArtistParamsSchema = z.object({
  artist: artistNameSchema,
});

// ============================================================================
// Ticketmaster API Endpoint Schemas
// ============================================================================

/**
 * Schema for Ticketmaster events route parameters: /api/ticketmaster/events/[id]
 */
export const ticketmasterEventsParamsSchema = z.object({
  id: z
    .string()
    .min(1, "City name cannot be empty")
    .max(100, "City name is too long"),
});

// ============================================================================
// Supabase API Endpoint Schemas
// ============================================================================

/**
 * Schema for artist object in Supabase
 */
export const artistSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(1).max(255),
  image: z.string().url().optional(),
  bio: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Schema for posting artists to Supabase
 */
export const postArtistsBodySchema = z.array(artistSchema);

/**
 * Schema for top artist object
 */
export const topArtistSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(1).max(255),
  rank: z.number().int().positive().optional(),
  image: z.string().url().optional(),
});

/**
 * Schema for posting top artists to Supabase
 */
export const postTopArtistsBodySchema = z.array(topArtistSchema);

// ============================================================================
// Tags API Endpoint Schemas
// ============================================================================

/**
 * Schema for individual tag
 */
export const tagSchema = z.object({
  name: z.string().min(1).max(100),
  id: z.union([z.string(), z.number()]).optional(),
});

/**
 * Schema for saveTags POST request body
 */
export const saveTagsBodySchema = z.object({
  tags: z.array(tagSchema).min(1, "At least one tag is required"),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validates data against a schema and returns a result object
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success status and either data or error
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError<any> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Formats Zod validation errors into a user-friendly message
 * @param error - Zod validation error
 * @returns Formatted error message
 */
export function formatValidationError(error: z.ZodError<any>): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join(", ");
}
