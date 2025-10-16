import { NextResponse } from "next/server";
import secureApiEndpoint from "../../../../../utils/apiSecurity";
import { authenticatedFetch } from "../../../../../utils/authenticatedFetch";

export async function GET(
  request: Request,
  context: { params: Promise<{ params: string[] }> }
) {
  // Apply security checks
  const security = secureApiEndpoint(request, null as any);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const { params } = await context.params;

    // Validate parameters
    if (!params || params.length !== 2) {
      return NextResponse.json(
        {
          error:
            "Invalid parameters. Expected format: /api/frontend/events/[locationId]/[city]",
        },
        { status: 400 }
      );
    }

    const [locationId, city] = params;

    // Validate locationId is numeric
    if (isNaN(Number(locationId))) {
      return NextResponse.json(
        { error: "Location ID must be numeric" },
        { status: 400 }
      );
    }

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
