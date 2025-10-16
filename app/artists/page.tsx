import { getArtistsCounts } from "../../utils/getArtists";
import ArtistsClient from "./ArtistsClient";
import { Metadata, Viewport } from "next";

const title = "Top Touring EDM DJ's & Artists";

export const metadata: Metadata = {
  title: title,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

// Revalidate every 1 month (2419200 seconds)
export const revalidate = 2419200;

export default async function ArtistsPage() {
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = "https://edmtrain.com/api/events?";
  const URL = EDMURL + "&client=" + KEY;

  let apiResponse;

  try {
    apiResponse = await fetch(URL);
  } catch (error: any) {
    console.error("Fetch failed: ", error);
    throw new Error(`Fetch failed: ${error.message}`);
  }

  if (!apiResponse.ok) {
    throw new Error(`HTTP error! status: ${apiResponse.status}`);
  }

  const json = await apiResponse.json();
  const uniqueArtists = getArtistsCounts(json.data);

  return <ArtistsClient uniqueArtists={uniqueArtists} />;
}
