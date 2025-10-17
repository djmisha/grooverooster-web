import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../features/Supabase";
import { secureAppRouterEndpoint } from "../../../../utils/appRouterSecurity";

const getData = async () => {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  try {
    const { data, error } = await supabaseAdmin.from("topartists").select("*");

    if (error) {
      console.error("Error fetching data: ", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error occurred: ", error);
    return null;
  }
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
