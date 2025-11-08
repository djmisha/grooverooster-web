/**
 * Shared TypeScript type definitions for the application
 */

// Artist Types
export interface Artist {
  name: string;
  id?: string | number;
  slug?: string;
  imageUrl?: string;
  bio?: string;
  mbid?: string;
  url?: string;
  link?: string;
  b2bInd?: boolean;
}

// Genre Types
export interface Genre {
  id: string;
  name: string;
  normalized_name: string;
  ticketmaster_genre_id?: string;
}

// Venue Types
export interface Venue {
  name: string;
  id?: string | number;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
  url?: string;
  location?: string;
  country?: string;
}

// Event Types
export interface Event {
  id: string | number;
  name: string;
  date: string;
  formattedDate?: string;
  venue: Venue;
  artistlist?: Artist[];
  artistList?: Artist[];
  image?: string;
  description?: string;
  ticketUrl?: string;
  price?: string;
  ageRestriction?: string;
  isVisible?: boolean;
  source?: string;
  eventSource?: string;
  festivalind?: boolean;
  festivalInd?: boolean;
  livestreamind?: boolean;
  livestreamInd?: boolean;
  livestreamUrl?: string;
  slug?: string;
  link?: string;
  ages?: string;
  electronicgenreind?: boolean;
  othergenreind?: boolean;
  starttime?: string;
  endtime?: string;
  createddate?: string;
  genres?: Genre[];
  primary_genre?: Genre;
}

// Location Types
export interface Location {
  id: string | number;
  city?: string;
  state: string;
  stateCode?: string;
  latitude?: number;
  longitude?: number;
  slug?: string;
  zipcode?: string;
}

// Filter Types
export interface FilterItemWithCount {
  name: string;
  count: number;
  originalDate?: string;
}

// Context Types - defined in features/AppContext.tsx to avoid circular dependency
export type { AppContextValue } from "@/features/AppContext";

// Profile Types
export interface Profile {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  city?: string | null;
  state?: string | null;
  updated_at?: string;
  created_at?: string;
}

// Date Types
export interface FormattedDate {
  dayOfWeek: string;
  dayMonth: string;
  daySchema: string;
}

// API Response Types - Note: Not currently used but reserved for future API standardization
export interface ApiResponse<T> {
  data?: T;
  error?: string | null;
  status?: number;
}

export interface EventsResponse {
  events: Event[];
  total?: number;
  page?: number;
  perPage?: number;
}

export interface ArtistsResponse {
  artists: Artist[];
  total?: number;
}

// Search Types
export interface SearchItem {
  id: string | number;
  name: string;
  type: string;
}

// Utility Types
export type SearchTerm = string;
export type EventId = string | number;
