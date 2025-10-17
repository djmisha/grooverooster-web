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
  imageUrl?: string;
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
}

// Location Types
export interface Location {
  id: string | number;
  city?: string;
  state: string;
  latitude?: number;
  longitude?: number;
  slug?: string;
  zipcode?: string;
}

// Filter Types
export interface FilterOptions {
  venues?: string[];
  dates?: string[];
  artists?: string[];
  promoters?: string[];
}

export interface FilterItemWithCount {
  name: string;
  count: number;
  originalDate?: string;
}

// Context Types
export interface AppContextValue {
  locationCtx: Location[];
  currentUserLocation: Location | null;
  addLocation: (location: Location) => void;
  setUserLocation: (location: Location) => void;
  clearUserLocation: () => void;
  supabase: any;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isLoggedIn: boolean;
}

// Profile Types
export interface Profile {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  updated_at?: string;
  created_at?: string;
}

// Date Types
export interface FormattedDate {
  dayOfWeek: string;
  dayMonth: string;
  daySchema: string;
}

// API Response Types
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

// Component Prop Types
export interface EventCardProps {
  event: Event;
  openEventId: EventId | null;
  setOpenEventId: (id: EventId | null) => void;
}

export interface FilterProps {
  events: Event[];
  filterType?: string;
  onFilterChange?: (filteredEvents: Event[]) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

// Utility Types
export type SearchTerm = string;
export type EventId = string | number;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
