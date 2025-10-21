import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/features/Supabase";
import { secureAppRouterEndpoint } from "@/utils/appRouterSecurity";
import type { RateLimitResult } from "@/types/rateLimit";

const getData = async () => {
  if (!supabaseAdmin) throw new Error("Supabase admin not configured");

  try {
    const { data, error } = await supabaseAdmin.from("topartists").select("*");

    if (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error occurred: ", error);
    throw error;
  }
};

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

  try {
    const data = await getData();
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "s-maxage=432000",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in handler: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
