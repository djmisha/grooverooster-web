"use client";

import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  useContext,
} from "react";
import { createClient } from "@/utils/supabase/component";
import {
  getSavedLocation,
  saveLocationToCookie,
} from "@/utils/locationService";
import { Location, Profile } from "@/types";
import type { SupabaseClientType } from "@/types/database";

export interface AppContextValue {
  locationCtx: Location[];
  currentUserLocation: Location | null;
  addLocation: (location: Location) => void;
  setUserLocation: (location: Location) => void;
  clearUserLocation: () => void;
  supabase: SupabaseClientType;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isLoggedIn: boolean;
}

/**
 * Application context for managing global state including location and user profile
 */
export const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * AppProvider component that provides global application state to children components
 * @param props - Component props
 * @param props.children - Child components to wrap with context
 * @returns Context provider with application state
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  const [locationCtx, setLocationCtx] = useState<Location[]>([]);
  const [currentUserLocation, setCurrentUserLocation] =
    useState<Location | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();
  const isProfileInitialized = useRef(false);

  // Set isProfileInitialized flag when profile is set from props
  useEffect(() => {
    if (profile && !isProfileInitialized.current) {
      isProfileInitialized.current = true;
    }
  }, [profile]);

  /**
   * Adds a new location to the location context array if it doesn't already exist
   * @param location - Location object to add
   */
  const addLocation = (location: Location) => {
    setLocationCtx((prevLocations) => {
      // Check if a location with the same id already exists in the array
      const locationExists = prevLocations.some(
        (prevLocation) => prevLocation.id === location.id
      );

      // If a location with the same id doesn't exist, add it to the array
      if (!locationExists) return [...prevLocations, location];

      // If a location with the same id already exists, return the previous array
      return prevLocations;
    });
  };

  /**
   * Sets the current user location and saves it to cookie
   * @param location - Location object to set as current
   */
  const setUserLocation = (location: Location) => {
    setCurrentUserLocation(location);
    if (location) {
      saveLocationToCookie(location);
      addLocation(location);
    }
  };

  /**
   * Clears the current user location and removes it from cookie
   */
  const clearUserLocation = () => {
    setCurrentUserLocation(null);
    saveLocationToCookie(null);
  };

  // Load saved location on app initialization
  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setCurrentUserLocation(savedLocation);
      addLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    // Only fetch user data if profile is not already initialized from server props
    if (isProfileInitialized.current) return;
    if (!supabase) return; // Skip if supabase is not configured

    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile if user exists
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
    };

    fetchUserAndProfile();
  }, [supabase]);

  const value = useMemo(
    () => ({
      locationCtx,
      currentUserLocation,
      addLocation,
      setUserLocation,
      clearUserLocation,
      supabase,
      profile,
      setProfile,
      isLoggedIn: !!profile,
    }),
    [locationCtx, currentUserLocation, profile, supabase]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use AppContext with type safety
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
