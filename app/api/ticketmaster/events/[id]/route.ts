import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "../../../../../utils/appRouterSecurity";
import type { RateLimitResult } from "../../../../../types/rateLimit";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
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

  const { id } = await context.params;
  const KEY = process.env.API_KEY_TICKETMASTER;
  const genreId = "KnvZfZ7vAvF"; // Dance / Electronic genreId

  // Build URL with city parameter
  const URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${KEY}&genreId=${genreId}&city=${encodeURIComponent(
    id
  )}`;

  try {
    const apiResponse = await fetch(URL);

    // Check if the response is ok
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(
        `Ticketmaster API error: ${apiResponse.status} - ${apiResponse.statusText}`
      );
      console.error(`Error response:`, errorText.substring(0, 500));
      return NextResponse.json({ _embedded: { events: [] } });
    }

    const data = await apiResponse.json();

    // Check if the API returned an error or no events
    if (data.fault || !data._embedded || !data._embedded.events) {
      console.log(`No events found for city: ${id}`);
      return NextResponse.json({ _embedded: { events: [] } });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=86400",
      },
    });
  } catch (error: any) {
    console.error("Error fetching Ticketmaster events:", error);
    return NextResponse.json({ _embedded: { events: [] } });
  }
}
