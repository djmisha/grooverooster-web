# TypeScript Migration Guide

This guide documents the TypeScript migration progress and provides patterns for converting the remaining JavaScript files.

## Migration Status

### ✅ Completed (15 files)

#### Configuration
- `tsconfig.json` - Enhanced with strict mode and comprehensive compiler options

#### Type Definitions
- `types/index.ts` - Centralized type definitions for the entire application

#### Utilities (9 files)
- `utils/utilities.ts` - Array, string, and data transformation utilities
- `utils/searchFilter.ts` - Event search and filtering
- `utils/setDates.ts` - Date formatting utilities
- `utils/cookieUtils.ts` - Cookie management
- `utils/canonicalUrl.ts` - SEO URL generation
- `utils/locationService.ts` - Comprehensive location services
- `utils/getLocations.ts` - Location data retrieval
- `utils/getUserLocation.ts` - IP-based location detection

#### Features (1 file)
- `features/AppContext.tsx` - Application context provider

#### Hooks (3 files)
- `hooks/useLocation.ts` - Location context hook
- `hooks/useEventModal.ts` - Modal state management
- `hooks/useCurrentUrl.ts` - Current URL tracking

#### Components (2 files)
- `components/Spinner/Spinner.tsx` - Loading spinner
- `components/Button/Button2.tsx` - Button component with variants

### 🔄 Remaining (~60 files)

#### Utilities (~10 files)
- `utils/authenticatedFetch.js`
- `utils/getEvents.js`
- `utils/apiSecurity.js`
- `utils/edmTrainTransformer.js`
- `utils/getArtists.js`
- `utils/setGeolocation.js`
- And others...

#### Components (~48 files)
- Event-related: `EventCard.js`, `EventDetails.js`, `EventsModule.js`
- Navigation: `NavigataionBar.js`, `Sidebar.js`, `LocationSelect.js`
- Artists: `Artists.js`, `ArtistBio.js`, `ArtistImage.js`
- Filters: `Filter.js`, `EventsFilter.js`, `DatePickerFilter.js`
- Homepage: `Hero.js`, `TopArtists.js`, `WelcomeMessage.js`
- And many more...

#### Features (~2 files)
- `features/Supabase.js`
- `features/services/*.js`

## Conversion Patterns

### 1. Basic Component Conversion

**Before (JS):**
```javascript
const MyComponent = ({ title, count, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click {count}</button>
    </div>
  );
};

export default MyComponent;
```

**After (TS/TSX):**
```typescript
import React from "react";

interface MyComponentProps {
  title: string;
  count: number;
  onAction: () => void;
}

const MyComponent = ({ title, count, onAction }: MyComponentProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click {count}</button>
    </div>
  );
};

export default MyComponent;
```

### 2. Utility Function Conversion

**Before (JS):**
```javascript
export const processEvents = (events) => {
  return events.filter(event => event.isVisible);
};
```

**After (TS):**
```typescript
import { Event } from "../types";

export const processEvents = (events: Event[]): Event[] => {
  return events.filter(event => event.isVisible);
};
```

### 3. API Function Conversion

**Before (JS):**
```javascript
export const fetchEvents = async (locationId) => {
  const response = await fetch(`/api/events/${locationId}`);
  const data = await response.json();
  return data;
};
```

**After (TS):**
```typescript
import { Event, ApiResponse } from "../types";

export const fetchEvents = async (locationId: string | number): Promise<Event[]> => {
  const response = await fetch(`/api/events/${locationId}`);
  const data: ApiResponse<Event[]> = await response.json();
  return data.data || [];
};
```

### 4. Hook Conversion

**Before (JS):**
```javascript
export const useCustomHook = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  
  const updateValue = (newValue) => {
    setValue(newValue);
  };
  
  return { value, updateValue };
};
```

**After (TS):**
```typescript
import { useState } from "react";

interface UseCustomHookReturn<T> {
  value: T;
  updateValue: (newValue: T) => void;
}

export const useCustomHook = <T,>(initialValue: T): UseCustomHookReturn<T> => {
  const [value, setValue] = useState<T>(initialValue);
  
  const updateValue = (newValue: T): void => {
    setValue(newValue);
  };
  
  return { value, updateValue };
};
```

## Common Type Definitions

Use these from `types/index.ts`:

```typescript
// Core data types
Event, Artist, Venue, Location, Profile

// API types
ApiResponse<T>, EventsResponse, ArtistsResponse

// Component props
EventCardProps, FilterProps, ModalProps

// Utility types
SearchTerm, EventId, Optional<T>, Nullable<T>
```

## Best Practices

1. **Always import types**: Import types from `types/index.ts` rather than defining locally
2. **Avoid `any`**: Use proper types or `unknown` if the type is truly unknown
3. **Use interfaces for objects**: Prefer interfaces over type aliases for object shapes
4. **Generic components**: Use generics for reusable components
5. **Discriminated unions**: Use for components that render differently based on props
6. **Optional props**: Mark optional props with `?` in the interface
7. **Default values**: Provide defaults in the function signature, not in the interface

## Migration Steps

1. **Rename file**: `.js` → `.ts` or `.jsx` → `.tsx`
2. **Add imports**: Import necessary types from `types/index.ts`
3. **Define interfaces**: Create interfaces for props, return types, etc.
4. **Add type annotations**: Annotate parameters and return types
5. **Fix errors**: Address any TypeScript errors
6. **Test**: Run linter and ensure no regressions
7. **Commit**: Commit the converted file

## Validation

After each conversion:

```bash
# Run linter
npm run lint

# TypeScript will check types automatically during linting
```

## Notes

- The migration allows gradual conversion - JavaScript and TypeScript can coexist
- All converted files maintain backward compatibility
- Focus on high-impact files first (core utilities, frequently used components)
- Document any complex type decisions in comments
- Consider creating additional interfaces in `types/index.ts` as needed

## Resources

- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Next.js with TypeScript: https://nextjs.org/docs/basic-features/typescript
