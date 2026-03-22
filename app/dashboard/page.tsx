import { createClient } from "@/utils/supabase/server";
import { getLocations } from "@/utils/getLocations";
import { Metadata } from "next";
import DashboardOverview from "@/components/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Dashboard page component - displays user dashboard overview
 * @returns {Promise<JSX.Element>} User dashboard overview page
 */
// Force dynamic rendering since this page uses cookies
export const dynamic = "force-dynamic";

interface UserProfile {
  id: string;
  default_location_id?: string | number;
  username?: string;
  email?: string;
  [key: string]: any;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const locations = getLocations();

  if (!supabase)
    return (
      <DashboardOverview profile={null} user={null} defaultLocation={null} />
    );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  let profile: UserProfile | null = null;
  let defaultLocation: any = null;

  if (user) {
    // Fetch user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = profileData || null;

    // If profile has default location, fetch the location data
    if (profile?.default_location_id) {
      const locationId = parseInt(String(profile.default_location_id), 10);
      defaultLocation =
        locations.find((loc: any) => loc.id === locationId) || null;
    }
  }

  return (
    <DashboardOverview
      profile={profile}
      user={user}
      defaultLocation={defaultLocation}
    />
  );
}
