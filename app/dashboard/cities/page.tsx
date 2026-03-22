import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import locationsData from "@/utils/locations.json";
import DashboardCities from "@/components/dashboard/dashboard-cities";

export const metadata: Metadata = {
  title: "My Cities",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface LocationData {
  id: number;
  city?: string;
  state: string;
  stateCode: string;
}

export default async function DashboardCitiesPage() {
  const supabase = await createClient();
  const locations = locationsData as LocationData[];

  if (!supabase)
    return (
      <DashboardCities
        userId={undefined}
        initialLocations={[]}
        allLocations={locations}
      />
    );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  let profile = null;
  let userLocations: any[] = [];

  if (user) {
    // Fetch user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = profileData;

    // Get user's saved location IDs
    const otherLocationIds = profile?.other_locations || [];
    const defaultLocationId = profile?.default_location_id;

    // Combine all location IDs
    const allLocationIds = defaultLocationId
      ? [
          defaultLocationId,
          ...otherLocationIds.filter((id: number) => id !== defaultLocationId),
        ]
      : otherLocationIds;

    // Map to full location objects
    userLocations = allLocationIds
      .map((locationId: number) => {
        const location = locations.find((loc) => loc.id === locationId);
        if (location) {
          return {
            ...location,
            isDefault: locationId === defaultLocationId,
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  return (
    <DashboardCities
      userId={user?.id}
      initialLocations={userLocations}
      allLocations={locations}
    />
  );
}
