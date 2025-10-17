import { redirect } from "next/navigation";
import UserDashboard from "../../components/User/UserDashboard";
import { createClient } from "../../utils/supabase/server";
import { getLocations } from "../../utils/getLocations";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Dashboard page component - displays user dashboard with profile and preferences
 * @returns {Promise<JSX.Element>} User dashboard page or redirect to login
 */
// Force dynamic rendering since this page uses cookies
export const dynamic = "force-dynamic";

interface UserProfile {
  id: string;
  default_location_id?: string | number;
  [key: string]: any;
}

export default async function DashboardPage() {
  try {
    const supabase = await createClient();
    const locations = getLocations();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      redirect("/login");
    }

    const user = data.user;
    let profile: UserProfile | null = null;
    let defaultLocation: any = null;

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

    return (
      <UserDashboard profile={profile} defaultLocation={defaultLocation} />
    );
  } catch (error) {
    // If Supabase is not configured or there's an error, redirect to login
    console.error("Error in dashboard:", error);
    redirect("/login");
  }
}
