import { Metadata, Viewport } from "next";
import Layout, { siteTitle } from "../components/layout";
import { createClient } from "../utils/supabase/server";
import { getCanonicalUrl } from "../utils/canonicalUrl";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: siteTitle,
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
