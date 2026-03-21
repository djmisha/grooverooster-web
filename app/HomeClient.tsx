"use client";

import { useContext, useEffect } from "react";
import { AppContext } from "@/features/AppContext";
import Verify from "@/components/Auth/Verify";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Homepage/Hero";
import TopArtists from "@/components/Homepage/TopArtists";
import WelcomeMessage from "@/components/Homepage/WelcomeMessage";
import ClientNavigationBar from "@/app/ClientNavigationBar";
import Locator from "@/components/Locator/Locator";
import CityActivityModule from "@/components/CityActivityModule/CityActivityModule";

/**
 * HomeClient component renders the client-side home page content
 * @param {Object} props - Component props
 * @param {any} props.profile - User profile data from server
 * @returns {JSX.Element} Home page client components
 */
export default function HomeClient({ profile }: { profile: any }) {
  const context = useContext(AppContext);

  // Update AppContext with profile data when component mounts
  useEffect(() => {
    if (profile && context) {
      context.setProfile(profile);
    }
  }, [profile, context]);

  return (
    <>
      <ClientNavigationBar />
      <Verify />
      <Hero />
      <WelcomeMessage />
      <Locator />
      <TopArtists />
      <CityActivityModule />
      <Footer />
    </>
  );
}
