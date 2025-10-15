import { Metadata } from "next";
import Verify from "../components/Auth/Verify";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Homepage/Hero";
import TopArtists from "../components/Homepage/TopArtists";
import WelcomeMessage from "../components/Homepage/WelcomeMessage";
import Layout, { siteTitle } from "../components/layout";
import NavigationBar from "../components/Navigation/NavigataionBar";
import { getLocations } from "../utils/getLocations";
import { createClient } from "../utils/supabase/server";
import Locator from "../components/Locator/Locator";
import { getCanonicalUrl } from "../utils/canonicalUrl";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: siteTitle,
  other: {
    "impact-site-verification": "5cfd0d65-e35f-46d0-888f-cd6252e7d10c",
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export default async function Home() {
  const locations = getLocations();

  // Use server-side client to check authentication status
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  // Get user data if logged in
  const user = userData?.user || null;
  let profile = null;
  let defaultLocation = null;

  // If user is logged in, fetch their profile
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*") // Fetch all fields instead of just specific ones
      .eq("id", user.id)
      .single();

    profile = profileData || null;

    // If profile has default location, fetch the location data
    if (profile?.default_location_id) {
      // Convert default_location_id to number to ensure correct comparison
      const locationId = parseInt(profile.default_location_id, 10);

      // Find the location in the locations array
      defaultLocation = locations.find((loc: any) => loc.id === locationId) || null;
    }
  }

  const canonicalUrl = getCanonicalUrl('/');

  return (
    <Layout home canonicalUrl={canonicalUrl}>
      <HomeClient profile={profile} />
      <NavigationBar />
      <Verify />
      <Hero />
      <WelcomeMessage />
      <Locator />
      <TopArtists />
      {/* <SignupCTA /> */}
      <Footer />
    </Layout>
  );
}
