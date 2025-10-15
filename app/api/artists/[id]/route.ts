import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST;
  const URL = EDMURL + id + "&client=" + KEY;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=604800",
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
