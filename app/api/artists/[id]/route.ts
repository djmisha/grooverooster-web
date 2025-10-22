import { NextResponse } from "next/server";
import {
  artistsIdParamsSchema,
  validateData,
  formatValidationError,
} from "@/lib/validation/schemas";
import { transformEDMTrainEventsArray } from "@/utils/edmTrainTransformer";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Validate params using Zod schema
  const validation = validateData(artistsIdParamsSchema, { id });
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid parameters",
        details: formatValidationError(validation.error),
      },
      { status: 400 }
    );
  }

  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST;

  if (!EDMURL || !KEY) {
    return NextResponse.json(
      { error: "Missing API configuration" },
      { status: 500 }
    );
  }

  const URL = `${EDMURL}${id}&client=${KEY}`;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();

    // Transform EDM Train legacy format to new SDHM format
    const transformedData = {
      ...data,
      data: transformEDMTrainEventsArray(data.data || []),
    };

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "s-maxage=604800",
      },
    });
  } catch (error: any) {
    console.error("Error fetching artist events:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}
