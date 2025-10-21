import { NextResponse } from "next/server";
import {
  postArtistsBodySchema,
  validateData,
  formatValidationError,
} from "@/lib/validation/schemas";
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

  try {
    const body = await request.json();

    // Validate request body using Zod schema
    const validation = validateData(postArtistsBodySchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: formatValidationError(validation.error),
        },
        { status: 400 }
      );
    }

    // Body is validated, return success
    return NextResponse.json({ message: "Hello" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
