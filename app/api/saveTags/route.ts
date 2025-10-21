import { NextResponse } from "next/server";
import {
  saveTagsBodySchema,
  validateData,
  formatValidationError,
} from "../../../lib/validation/schemas";
import { supabaseAdmin } from "@/features/Supabase";
import { secureAppRouterEndpoint } from "@/utils/appRouterSecurity";
import type { RateLimitResult } from "@/types/rateLimit";

export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  // Apply security checks
  const security: RateLimitResult = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  const body = await request.json();

  // Validate request body using Zod schema
  const validation = validateData(saveTagsBodySchema, body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid tags data",
        details: formatValidationError(validation.error),
      },
      { status: 400 }
    );
  }

  const { tags } = validation.data;

  const normalizedTags = tags.map((tag: any) => ({
    ...tag,
    name: tag.name.toLowerCase().replace(/-/g, " "),
  }));

  const chunkSize = 1000;
  for (let i = 0; i < normalizedTags.length; i += chunkSize) {
    const chunk = normalizedTags.slice(i, i + chunkSize);
    for (const tag of chunk) {
      const { data, error } = await supabaseAdmin
        .from("artist_tags")
        .select("id")
        .eq("name", tag.name);

      if (error) {
        console.error("Error checking tag:", error);
        continue;
      }

      if (data.length === 0) {
        const { error: insertError } = await supabaseAdmin
          .from("artist_tags")
          .insert([{ name: tag.name }]);

        if (insertError) {
          console.error("Error inserting tag:", insertError);
        }
      }
    }
  }

  return NextResponse.json({ message: "Tags saved successfully" });
}
