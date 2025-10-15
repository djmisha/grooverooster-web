"use client";

import { useContext, useEffect } from "react";
import { AppContext } from "../features/AppContext";

export default function HomeClient({ profile }: { profile: any }) {
  const { setProfile } = useContext(AppContext);

  // Update AppContext with profile data when component mounts
  useEffect(() => {
    if (profile) setProfile(profile);
  }, [profile, setProfile]);

  return null;
}
