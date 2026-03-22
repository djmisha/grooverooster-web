import { Metadata, Viewport } from "next";
import Layout, { siteTitle } from "@/components/layout";
import { createClient } from "@/utils/supabase/server";
import { getCanonicalUrl } from "@/utils/canonicalUrl";
import HomeClient from "@/app/HomeClient";

export const metadata: Metadata = {
  title: siteTitle,
  description:
    "Find house music, EDM, and electronic dance music events in a city near you. Discover upcoming DJ shows, nightclub events, raves and music festivals.",
  keywords: [
    "house music events",
    "EDM events near me",
    "electronic dance music",
    "nightclub events",
    "DJ shows",
    "rave events",
    "EDM festivals",
    "dance music concerts",
    "electronic music near me",
    "techno events",
  ],
  alternates: {
    canonical: "https://www.grooverooster.com/",
  },
  openGraph: {
    title: siteTitle,
    description:
      "Find house music, EDM, and electronic dance music events in a city near you. Discover upcoming DJ shows, nightclub events, raves and music festivals.",
    url: "https://www.grooverooster.com/",
    type: "website",
    images: [
      {
        url: "/images/housemusic.png",
        width: 1200,
        height: 630,
        alt: "GrooveRooster - House Music & EDM Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description:
      "Find house music, EDM, and electronic dance music events in a city near you.",
    images: ["/images/housemusic.png"],
  },
  other: {
    "impact-site-verification": "5cfd0d65-e35f-46d0-888f-cd6252e7d10c",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

// Force dynamic rendering since this page uses cookies
export const dynamic = "force-dynamic";

/**
 * Home page component that displays the main landing page
 * @returns {Promise<JSX.Element>} The home page with user profile and location data
 */
export default async function Home() {
  // Get user data if logged in
  let profile: any = null;

  try {
    // Use server-side client to check authentication status
    const supabase = await createClient();
    if (!supabase) throw new Error("Supabase not configured");
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user || null;

    // If user is logged in, fetch their profile
    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*") // Fetch all fields instead of just specific ones
        .eq("id", user.id)
        .single();

      profile = profileData || null;
    }
  } catch (error) {
    // Supabase not configured or error fetching user data
    // Continue without authentication
    console.error("Error initializing Supabase:", error);
  }

  const canonicalUrl = getCanonicalUrl("/");

  return (
    <Layout home canonicalUrl={canonicalUrl}>
      <HomeClient profile={profile} />
    </Layout>
  );
}
