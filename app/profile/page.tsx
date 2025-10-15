import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import NavigationBar from "../../components/Navigation/NavigataionBar";
import EditProfile from "../../components/User/EditProfile";
import { createClient } from "../../utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <NavigationBar setSearchTerm={() => {}} locationData={{}} />
      <EditProfile user={data.user} />
    </>
  );
}
