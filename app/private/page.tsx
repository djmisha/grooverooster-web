import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private",
};

// Force dynamic rendering since this page uses cookies
export const dynamic = "force-dynamic";

export default async function PrivatePage() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      redirect("/");
    }

    return (
      <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px]">
        Hello, {data.user.email || "user"}!
      </h1>
    );
  } catch (error) {
    // If Supabase is not configured or there's an error, redirect to home
    console.error("Error in private page:", error);
    redirect("/");
  }
}
