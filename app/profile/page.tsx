import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import ClientNavigationBar from "./ClientNavigationBar";
import EditProfile from "../../components/User/EditProfile";
import { createClient } from "../../utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      redirect("/login");
    }

    return (
      <>
        <ClientNavigationBar />
        <EditProfile user={data.user} />
      </>
    );
  } catch (error) {
    // If Supabase is not configured or there's an error, redirect to login
    console.error("Error in profile page:", error);
    redirect("/login");
  }
}
