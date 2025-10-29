import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      redirect("/login");
    }

    return <DashboardLayout>{children}</DashboardLayout>;
  } catch (error) {
    console.error("Error in dashboard layout:", error);
    redirect("/login");
  }
}
