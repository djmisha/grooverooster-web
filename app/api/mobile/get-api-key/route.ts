import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "../../../../utils/appRouterSecurity";
import type { RateLimitResult } from "../../../../types/rateLimit";

export async function GET(request: Request) {
  // Apply security checks
  const security: RateLimitResult = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  return NextResponse.json({ apiKey });
}
