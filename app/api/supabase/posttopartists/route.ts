import { NextResponse } from "next/server";
import supabase from "../../../../features/Supabase";
import { secureAppRouterEndpoint } from "../../../../utils/appRouterSecurity";

const setData = async (artists: any[]) => {
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
    const { data, error: insertError } = await supabase
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
  const security = secureAppRouterEndpoint(request);

  // Check if request is allowed
  if (!security.allowed) {
    return NextResponse.json(
      { error: security.error || "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json({ message: "Missing body" }, { status: 400 });
    }

    await setData(body);
    return NextResponse.json({ message: "Success" });
  } catch (error: any) {
    console.error("Error in handler: ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
