import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "../../../../../utils/appRouterSecurity";
import type { RateLimitResult } from "../../../../../types/rateLimit";
import {
  lastfmArtistParamsSchema,
  validateData,
  formatValidationError,
} from "../../../../../lib/validation/schemas";

export async function GET(
  request: Request,
  context: { params: Promise<{ artist: string }> }
) {
  // Apply security checks
  const security: RateLimitResult = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  const { artist } = await context.params;

  // Validate params using Zod schema
  const validation = validateData(lastfmArtistParamsSchema, { artist });
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid parameters",
        details: formatValidationError(validation.error),
      },
      { status: 400 }
    );
  }

  const KEY = process.env.NEXT_PUBLIC_API_KEY_LASTFM;
  const URL = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${KEY}&format=json`;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=2592000",
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
