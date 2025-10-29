import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import DashboardProfile from "@/components/dashboard/dashboard-profile";

export const metadata: Metadata = {
  title: "Profile Settings",
};

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return <DashboardProfile user={user} />;
}
