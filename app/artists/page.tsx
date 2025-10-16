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

  let uniqueArtists: any[] = [];

  try {
    const apiResponse = await fetch(URL, { cache: "no-store" });
    
    if (!apiResponse.ok) {
      console.error(`HTTP error! status: ${apiResponse.status}`);
      // Return empty list if API fails during build
      return <ArtistsClient uniqueArtists={[]} />;
    }

    const json = await apiResponse.json();
    uniqueArtists = getArtistsCounts(json.data);
  } catch (error: any) {
    console.error("Fetch failed: ", error);
    // Return empty list if fetch fails during build
    return <ArtistsClient uniqueArtists={[]} />;
  }

  return <ArtistsClient uniqueArtists={uniqueArtists} />;
}
