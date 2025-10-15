import { NextResponse } from "next/server";
import secureApiEndpoint from "../../../../utils/apiSecurity";

export async function POST(request: Request) {
  // Apply security checks
  const security = secureApiEndpoint(request, null as any);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: "Hello" });
}
