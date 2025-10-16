import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../features/Supabase";
import secureApiEndpoint from "../../../utils/apiSecurity";

export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  // Apply security checks
  const security = secureApiEndpoint(request, null as any);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { tags } = body;

  if (!tags || !Array.isArray(tags)) {
    return NextResponse.json({ error: "Invalid tags data" }, { status: 400 });
  }

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
