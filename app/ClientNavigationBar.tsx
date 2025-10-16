"use client";

import NavigationBar from "../components/Navigation/NavigataionBar";

/**
 * ClientNavigationBar component wraps the navigation bar for client-side rendering
 * @returns {JSX.Element} Navigation bar component
 */
export default function ClientNavigationBar() {
  return <NavigationBar setSearchTerm={() => {}} locationData={{}} />;
}
