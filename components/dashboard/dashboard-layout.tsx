"use client";

import { useRouter } from "next/navigation";
import { DashboardSidebar } from "./sidebar";
import { useAppContext } from "@/features/AppContext";
import DashboardToastProvider from "@/components/ui/DashboardToastProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { supabase } = useAppContext();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-4 pt-20 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>
      <DashboardToastProvider />
    </div>
  );
}
