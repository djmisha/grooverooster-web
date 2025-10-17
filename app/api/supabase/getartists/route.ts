import { NextResponse } from "next/server";
import supabase from "../../../../features/Supabase";
import { secureAppRouterEndpoint } from "../../../../utils/appRouterSecurity";

const fetchExistingArtists = async () => {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  let allArtists: any[] = [];
  let from = 0;
  const limit = 900;
  let fetchMore = true;

  while (fetchMore) {
    const { data, error } = await supabase
      .from("artists")
      .select("id, name")
      .range(from, from + limit - 1);

    if (error) {
      console.error("Error fetching existing artists", error);
      throw error;
    }

    if (data && data.length > 0) {
      allArtists = [...allArtists, ...data];
      from += limit;
    } else {
      fetchMore = false;
    }
  }

  return allArtists;
};

export async function GET(request: Request) {
  // Apply security checks
  const security = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    // Fetch all existing artists from Supabase
    const artists = await fetchExistingArtists();

    // Send a response with the fetched artists
    return NextResponse.json({
      message: "Artists fetched successfully",
      artists,
    });
  } catch (error: any) {
    console.error("Error in handler:", error);
    return NextResponse.json(
      { message: "Error fetching artists", error: error.message },
      { status: 500 }
    );
  }
}
