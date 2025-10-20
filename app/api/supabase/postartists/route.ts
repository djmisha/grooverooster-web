import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "@/utils/appRouterSecurity";
import type { RateLimitResult } from "@/types/rateLimit";

export async function POST(request: Request) {
  // Apply security checks
  const security: RateLimitResult = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: "Hello" });
}
