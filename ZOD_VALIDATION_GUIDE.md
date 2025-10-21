# Zod Validation Implementation Guide

## Overview

This document describes the centralized Zod validation implementation for all API endpoints in the GrooveRooster web application.

## Location

- **Schema Library**: `/lib/validation/schemas.ts`
- **Updated Routes**: 9 API route handlers in `/app/api/`

## Architecture

### Centralized Schema Library

All validation schemas are defined in a single file (`/lib/validation/schemas.ts`) to ensure consistency and maintainability. This approach provides:

- **Single source of truth** for validation rules
- **Easy maintenance** - update validation rules in one place
- **Type safety** - leverages TypeScript and Zod integration
- **Reusability** - common schemas shared across endpoints

### Common Schemas

The following common schemas are available for reuse:

```typescript
// Validates numeric IDs (e.g., "123")
numericIdSchema;

// Validates city names (letters, spaces, hyphens only)
cityNameSchema;

// Validates artist names (1-255 characters)
artistNameSchema;

// Validates UUIDs
uuidSchema;
```

### Helper Functions

Two helper functions are provided for consistent error handling:

1. **`validateData<T>(schema, data)`**
   - Validates data against a schema
   - Returns: `{ success: true, data: T }` or `{ success: false, error: ZodError }`

2. **`formatValidationError(error)`**
   - Formats Zod validation errors into user-friendly messages
   - Returns: String with path and message (e.g., "name: Invalid name")

## Usage Examples

### Validating Route Parameters

```typescript
import {
  eventsIdParamsSchema,
  validateData,
  formatValidationError,
} from "@/lib/validation/schemas";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Validate params
  const validation = validateData(eventsIdParamsSchema, { id });
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid parameters",
        details: formatValidationError(validation.error),
      },
      { status: 400 }
    );
  }

  // Continue with validated data
  // validation.data.id is guaranteed to be a numeric string
}
```

### Validating Request Bodies

```typescript
import {
  saveTagsBodySchema,
  validateData,
  formatValidationError,
} from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json();

  // Validate request body
  const validation = validateData(saveTagsBodySchema, body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: formatValidationError(validation.error),
      },
      { status: 400 }
    );
  }

  // Continue with validated data
  const { tags } = validation.data;
}
```

## API Endpoints with Validation

| Endpoint                             | Schema                           | Validates                      |
| ------------------------------------ | -------------------------------- | ------------------------------ |
| `/api/sdhm/[...params]`              | `sdhmParamsSchema`               | Numeric ID, city name          |
| `/api/events/[id]`                   | `eventsIdParamsSchema`           | Numeric ID                     |
| `/api/artists/[id]`                  | `artistsIdParamsSchema`          | Numeric ID                     |
| `/api/frontend/events/[...params]`   | `frontendEventsParamsSchema`     | Numeric location ID, city name |
| `/api/lastfm/artistgetinfo/[artist]` | `lastfmArtistParamsSchema`       | Artist name                    |
| `/api/ticketmaster/events/[id]`      | `ticketmasterEventsParamsSchema` | City name                      |
| `/api/saveTags`                      | `saveTagsBodySchema`             | Tags array                     |
| `/api/supabase/postartists`          | `postArtistsBodySchema`          | Artists array                  |
| `/api/supabase/posttopartists`       | `postTopArtistsBodySchema`       | Top artists array              |

## Adding New Validations

To add validation to a new endpoint:

1. **Define schema** in `/lib/validation/schemas.ts`:

   ```typescript
   export const myNewEndpointSchema = z.object({
     field: z.string().min(1).max(100),
   });
   ```

2. **Import in route handler**:

   ```typescript
   import {
     myNewEndpointSchema,
     validateData,
     formatValidationError,
   } from "@/lib/validation/schemas";
   ```

3. **Validate data**:
   ```typescript
   const validation = validateData(myNewEndpointSchema, data);
   if (!validation.success) {
     return NextResponse.json(
       {
         error: "Invalid data",
         details: formatValidationError(validation.error),
       },
       { status: 400 }
     );
   }
   ```

## Security Benefits

- **Prevents injection attacks** - Strict validation of all inputs
- **Data integrity** - Ensures data matches expected format
- **Type safety** - TypeScript integration catches errors at compile time
- **Consistent error messages** - Doesn't leak sensitive information
- **Input sanitization** - Automatic through schema constraints

## Testing

All validation changes have been tested with:

- TypeScript compilation ✅
- ESLint checks ✅
- Next.js build ✅
- CodeQL security analysis ✅ (0 alerts)

## References

- [Zod Documentation](https://zod.dev/)
- [Security Scan Report](../SECURITY_SCAN_REPORT.md) - Section 6.1
- [Zod v4 Migration Guide](https://zod.dev/?id=zod-4)
