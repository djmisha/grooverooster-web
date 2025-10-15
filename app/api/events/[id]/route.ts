import { NextResponse } from "next/server";
import secureApiEndpoint from "../../../../utils/apiSecurity";

const CACHE_MAX_AGE = 21600; // 6 hours in seconds

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
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
