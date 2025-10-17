import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "../../../../utils/appRouterSecurity";

// Force this route to be dynamic to ensure date filtering uses current date
export const dynamic = "force-dynamic";

const CACHE_MAX_AGE = 21600; // 6 hours in seconds

/**
 * GET handler for retrieving events by location ID
 * @param {Request} request - HTTP request object
 * @param {Object} context - Route context with params
 * @param {Promise<{id: string}>} context.params - Route parameters containing location ID
 * @returns {Promise<NextResponse>} JSON response with events data
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Apply security checks
  const security = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
  const URL = EDMURL + id + "&client=" + KEY;

  try {
    // Always fetch from EDMtrain
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();

    if (!data.data) {
      throw new Error("Invalid event data received");
    }

    // Always return fresh API data
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`,
      },
    });
  } catch (error: any) {
    console.error("Error details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
