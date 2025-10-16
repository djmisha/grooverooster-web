"use client";

import { useContext, useEffect } from "react";
import { AppContext } from "../features/AppContext";
import Verify from "../components/Auth/Verify";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Homepage/Hero";
import TopArtists from "../components/Homepage/TopArtists";
import WelcomeMessage from "../components/Homepage/WelcomeMessage";
import ClientNavigationBar from "./ClientNavigationBar";
import Locator from "../components/Locator/Locator";

export default function HomeClient({ profile }: { profile: any }) {
  const { setProfile } = useContext(AppContext);

  // Update AppContext with profile data when component mounts
  useEffect(() => {
    if (profile) setProfile(profile);
  }, [profile, setProfile]);

  return (
    <>
      <ClientNavigationBar />
      <Verify />
      <Hero />
      <WelcomeMessage />
      <Locator />
      <TopArtists />
      <Footer />
    </>
  );
}
