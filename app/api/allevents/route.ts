import { NextResponse } from "next/server";
import secureApiEndpoint from "../../../utils/apiSecurity";

export const config = {
  api: {
    responseLimit: false,
  },
};

export async function GET(request: Request) {
  // Apply security checks
  const security = secureApiEndpoint(request, null as any);

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
    
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=604800",
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
