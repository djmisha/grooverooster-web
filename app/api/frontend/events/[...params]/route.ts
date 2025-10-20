import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "../../../../../utils/appRouterSecurity";
import { authenticatedFetch } from "../../../../../utils/authenticatedFetch";
import type { RateLimitResult } from "../../../../../types/rateLimit";
import {
  frontendEventsParamsSchema,
  validateData,
  formatValidationError,
} from "../../../../../lib/validation/schemas";

export async function GET(
  request: Request,
  context: { params: Promise<{ params: string[] }> }
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

  try {
    const { params } = await context.params;

    // Validate params using Zod schema
    const validation = validateData(frontendEventsParamsSchema, { params });
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid parameters",
          details: formatValidationError(validation.error),
        },
        { status: 400 }
      );
    }

    const [locationId, city] = validation.data.params;

    // Make authenticated request to the secured SDHM endpoint
    const sdhmUrl = `/api/sdhm/${locationId}/${encodeURIComponent(city)}`;
    const data = await authenticatedFetch(sdhmUrl);

    // Return the data
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Frontend events proxy error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch events data",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
