import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import DashboardArtists from "@/components/dashboard/dashboard-artists";

export const metadata: Metadata = {
  title: "My Artists",
};

export const dynamic = "force-dynamic";

export default async function DashboardArtistsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  let favoriteArtistIds: number[] = [];

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("favorite_artists")
      .eq("id", user.id)
      .single();

    favoriteArtistIds = profileData?.favorite_artists || [];
  }

  return (
    <DashboardArtists
      userId={user?.id}
      initialFavoriteIds={favoriteArtistIds}
    />
  );
}
