"use client";

import NavigationBar from "@/components/Navigation/NavigataionBar";

/**
 * ClientNavigationBar component wraps the navigation bar for client-side rendering
 */
export default function ClientNavigationBar() {
  return <NavigationBar setSearchTerm={() => {}} locationData={[]} />;
}
