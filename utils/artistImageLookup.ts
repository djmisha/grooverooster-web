import localArtistsDB from "@/localArtistsDB.json";

// Create a Set of artist IDs for O(1) lookup
const artistIdSet = new Set(localArtistsDB.map((a) => a.id));

/**
 * Checks if an artist exists in the local database by ID
 * @param artistId - The ID of the artist to check
 * @returns True if the artist exists in the local database
 */
export const artistExistsInDatabase = (
  artistId: string | number | undefined
): boolean => {
  if (!artistId) return false;
  const numericId =
    typeof artistId === "string" ? parseInt(artistId, 10) : artistId;
  return artistIdSet.has(numericId);
};

/**
 * Gets the artist ID if it exists in the local database, otherwise checks by name
 * @param artist - Artist object with optional id and name
 * @returns The numeric artist ID if found in database, undefined otherwise
 */
export const getArtistDbId = (artist: {
  id?: string | number;
  name: string;
}): number | undefined => {
  // First check if we have a valid numeric ID in our database
  if (artist.id) {
    const numericId =
      typeof artist.id === "string" ? parseInt(artist.id, 10) : artist.id;
    if (artistIdSet.has(numericId)) {
      return numericId;
    }
  }
  // Fall back to name lookup
  return getArtistIdByName(artist.name);
};

/**
 * Looks up an artist's EDMTrain ID from the local database by name
 * @param artistName - The name of the artist to look up
 * @returns The numeric EDMTrain ID if found, undefined otherwise
 */
export const getArtistIdByName = (artistName: string): number | undefined => {
  if (!artistName) return undefined;

  // Normalize the artist name for comparison (case-insensitive, trim whitespace)
  const normalizedSearchName = artistName.toLowerCase().trim();

  // Find the artist in the local database
  const artist = localArtistsDB.find(
    (a) => a.name.toLowerCase().trim() === normalizedSearchName
  );

  return artist?.id;
};

/**
 * Gets the EDMTrain ID for the first artist in an event's artist list
 * @param artistList - Array of artists from the event
 * @returns The numeric EDMTrain ID if found, undefined otherwise
 */
export const getFirstArtistImageId = (
  artistList: Array<{ id?: string | number; name: string }>
): number | undefined => {
  if (!artistList || artistList.length === 0) return undefined;

  const firstArtist = artistList[0];

  // If no ID exists, try to look up by name
  if (!firstArtist.id) {
    return getArtistIdByName(firstArtist.name);
  }

  // If the ID is already a number (old API format), return it
  if (typeof firstArtist.id === "number") {
    return firstArtist.id;
  }

  // If the ID is a UUID string (new API format), look up by name
  if (typeof firstArtist.id === "string" && firstArtist.name) {
    return getArtistIdByName(firstArtist.name);
  }

  return undefined;
};
