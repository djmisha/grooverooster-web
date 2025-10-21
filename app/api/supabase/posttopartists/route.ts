import { NextResponse } from "next/server";
import {
  postTopArtistsBodySchema,
  validateData,
  formatValidationError,
} from "@/lib/validation/schemas";
import supabase from "@/features/Supabase";
import { secureAppRouterEndpoint } from "@/utils/appRouterSecurity";
import type { RateLimitResult } from "@/types/rateLimit";

const setData = async (artists: any[]) => {
  if (!supabase) throw new Error("Supabase not configured");

  try {
    // Delete all rows
    const { error: deleteError } = await supabase
      .from("topartists")
      .delete()
      .gte("id", 0);

    if (deleteError) {
      console.error("Error deleting data: ", deleteError);
      throw deleteError;
    }

    // Insert new rows
    const { error: insertError } = await supabase
      .from("topartists")
      .insert(artists);

    if (insertError) {
      console.error("Error inserting data: ", insertError);
      throw insertError;
    }
  } catch (error) {
    console.error("Error in setData: ", error);
    throw error;
  }
};

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
    const validation = validateData(postTopArtistsBodySchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: formatValidationError(validation.error),
        },
        { status: 400 }
      );
    }

    await setData(validation.data);
    return NextResponse.json({ message: "Success" });
  } catch (error: any) {
    console.error("Error in handler: ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
