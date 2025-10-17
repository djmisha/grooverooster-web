import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "../../../../../utils/appRouterSecurity";

export async function GET(
  request: Request,
  context: { params: Promise<{ artist: string }> }
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

  const { artist } = await context.params;
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
