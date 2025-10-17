import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "../../../utils/appRouterSecurity";
import { transformEDMTrainEventsArray } from "../../../utils/edmTrainTransformer";

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export const config = {
  api: {
    responseLimit: false,
  },
};

/**
 * GET handler for retrieving all events from all locations
 * @param {Request} request - HTTP request object
 * @returns {Promise<NextResponse>} JSON response with all events data
 */
export async function GET(request: Request) {
  // Apply security checks
  const security = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = "https://edmtrain.com/api/events?";
  const URL = EDMURL + "&client=" + KEY;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();
    
    // Transform EDM Train legacy format to new SDHM format
    const transformedData = {
      ...data,
      data: transformEDMTrainEventsArray(data.data || []),
    };
    
    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "s-maxage=604800",
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
