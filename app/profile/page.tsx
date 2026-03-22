import { redirect } from "next/navigation";
import ClientNavigationBar from "@/app/profile/ClientNavigationBar";
import EditProfile from "@/components/User/EditProfile";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

/**
 * Profile page component allows users to edit their profile information
 * @returns {Promise<JSX.Element>} Profile edit page or redirect to login
 */
// Force dynamic rendering since this page uses cookies
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  try {
    const supabase = await createClient();
    if (!supabase) redirect("/login");

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
