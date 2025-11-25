import { NextResponse } from "next/server";
import {
  sdhmVenuesParamsSchema,
  validateData,
  formatValidationError,
} from "@/lib/validation/schemas";
import { secureAppRouterEndpoint } from "@/utils/appRouterSecurity";
import type { RateLimitResult } from "@/types/rateLimit";

// Force this route to be dynamic
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ venueName: string }> }
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
    const { venueName } = await context.params;

    // Validate params using Zod schema
    const validation = validateData(sdhmVenuesParamsSchema, { venueName });
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid parameters",
          details: formatValidationError(validation.error),
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY_SDHM;
    const apiUrl = process.env.API_URL_SDHM;

    // Check if API key is configured
    if (!apiKey) {
      console.error("API_KEY_SDHM environment variable not set");
      return NextResponse.json(
        {
          error: "Server configuration error",
          message: "API key not configured",
        },
        { status: 500 }
      );
    }

    // Check if API URL is configured
    if (!apiUrl) {
      console.error("API_URL_SDHM environment variable not set");
      return NextResponse.json(
        {
          error: "Server configuration error",
          message: "API URL not configured",
        },
        { status: 500 }
      );
    }

    // URL encode the venue name for safe URL construction
    const encodedVenueName = encodeURIComponent(
      validation.data.venueName.toLowerCase()
    );

    // Construct the external API URL for venues endpoint
    const url = `${apiUrl}/venues/${encodedVenueName}`;

    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    // Make the request to the external API
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    // Check if the external API request was successful
    if (!response.ok) {
      // Log the response body for debugging
      const errorText = await response.text();
      console.error("External API error response:", errorText);

      return NextResponse.json(
        {
          error: `External API request failed with status ${response.status}`,
          message: response.statusText,
          details: errorText,
        },
        { status: response.status }
      );
    }

    // Parse the response data
    const data = await response.json();

    // Return the venue data
    return NextResponse.json(
      {
        success: true,
        data: data.data || data,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=43200, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    console.error("Error processing SDHM venues request:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}
