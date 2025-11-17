"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { useAppContext } from "@/features/AppContext";
import locations from "@/utils/locations.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
  default_location_id?: number;
}

interface DashboardProfileProps {
  user: User | null;
}

// Validation patterns
const PATTERNS = {
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  fullName: /^[a-zA-Z0-9\s-'.]{0,100}$/,
  url: /^(https?:\/\/)?([\w-]+\.)*[\w-]+\.[a-zA-Z]{2,}(\/[\w-.~:/?#[\]@!$&'()*+,;=]*)*\/?$/,
};

// Input sanitization function to prevent XSS
const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

export default function DashboardProfile({ user }: DashboardProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: "",
    full_name: "",
    avatar_url: "",
    website: "",
    default_location_id: undefined,
  });

  const [validationErrors, setValidationErrors] = useState({
    username: false,
    usernamePattern: false,
    fullNamePattern: false,
    avatarUrlPattern: false,
    websitePattern: false,
    default_location_id: false,
  });

  const { supabase } = useAppContext();

  const validateForm = useCallback((profileData: Partial<Profile>) => {
    const errors = {
      username: !profileData.username || profileData.username.trim() === "",
      usernamePattern: profileData.username
        ? !PATTERNS.username.test(profileData.username)
        : false,
      fullNamePattern: profileData.full_name
        ? !PATTERNS.fullName.test(profileData.full_name)
        : false,
      avatarUrlPattern: profileData.avatar_url
        ? !PATTERNS.url.test(profileData.avatar_url)
        : false,
      websitePattern: profileData.website
        ? !PATTERNS.url.test(profileData.website)
        : false,
      default_location_id: !profileData.default_location_id,
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof Profile, value: string) => {
      const sanitizedValue = ["avatar_url", "website"].includes(field)
        ? value.trim()
        : sanitizeInput(value.trim());

      setProfile((prev) => ({ ...prev, [field]: sanitizedValue }));
    },
    []
  );

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("No profile found");
        } else if (data) {
          const profileData = {
            username: data.username || "",
            full_name: data.full_name || "",
            avatar_url: data.avatar_url || "",
            website: data.website || "",
            default_location_id: data.default_location_id || undefined,
          };
          setProfile(profileData);
          validateForm(profileData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user?.id, supabase, validateForm]);

  useEffect(() => {
    validateForm(profile);
  }, [profile, validateForm]);

  const updateProfile = useCallback(async () => {
    if (!user?.id) return;

    if (!validateForm(profile)) {
      toast("⚠️ Please fix the validation errors before submitting");
      return;
    }

    try {
      setIsLoading(true);

      const sanitizedProfile = {
        username: sanitizeInput(profile.username?.trim() || ""),
        full_name: sanitizeInput(profile.full_name?.trim() || ""),
        avatar_url: profile.avatar_url?.trim() || "",
        website: profile.website?.trim() || "",
        default_location_id: profile.default_location_id,
      };

      const updates = {
        id: user.id,
        ...sanitizedProfile,
        default_location_id: sanitizedProfile.default_location_id
          ? parseInt(String(sanitizedProfile.default_location_id), 10)
          : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates, {
        onConflict: "id",
      });

      if (error) {
        toast(`❌ ${error.message}`);
      } else {
        toast("✅ Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("❌ An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [profile, validateForm, user?.id, supabase]);

  const groupedLocations = useMemo(() => {
    const stateGroups: Record<string, typeof locations> = {};

    locations.forEach((location) => {
      const state = location.state;
      if (!stateGroups[state]) {
        stateGroups[state] = [];
      }
      stateGroups[state].push(location);
    });

    return stateGroups;
  }, []);

  const formValid = !Object.values(validationErrors).some((error) => error);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px] text-3xl font-bold tracking-tight">
          Profile Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your profile details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={
                validationErrors.username || validationErrors.usernamePattern
                  ? "border-red-500"
                  : ""
              }
              maxLength={20}
            />
            {validationErrors.username && (
              <p className="text-sm text-red-500">Username is required</p>
            )}
            {validationErrors.usernamePattern && !validationErrors.username && (
              <p className="text-sm text-red-500">
                Username must be 3-20 characters and contain only letters,
                numbers, underscores or hyphens
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className={
                validationErrors.fullNamePattern ? "border-red-500" : ""
              }
              maxLength={100}
            />
            {validationErrors.fullNamePattern && (
              <p className="text-sm text-red-500">
                Full name contains invalid characters
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              type="url"
              value={profile.avatar_url}
              onChange={(e) => handleInputChange("avatar_url", e.target.value)}
              className={
                validationErrors.avatarUrlPattern ? "border-red-500" : ""
              }
              placeholder="https://example.com/avatar.png"
            />
            {validationErrors.avatarUrlPattern && profile.avatar_url && (
              <p className="text-sm text-red-500">Please enter a valid URL</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className={
                validationErrors.websitePattern ? "border-red-500" : ""
              }
              placeholder="https://example.com"
            />
            {validationErrors.websitePattern && profile.website && (
              <p className="text-sm text-red-500">Please enter a valid URL</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_location">
              Default Location <span className="text-red-500">*</span>
            </Label>
            <select
              id="default_location"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={profile.default_location_id || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  default_location_id: e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined,
                })
              }
            >
              <option value="">Select a location</option>
              {Object.keys(groupedLocations)
                .sort()
                .map((state) => (
                  <optgroup key={state} label={state}>
                    {groupedLocations[state]
                      .filter((location) => location.city)
                      .sort((a, b) =>
                        a.city && b.city ? a.city.localeCompare(b.city) : 0
                      )
                      .map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.city
                            ? `${location.city}, ${location.stateCode}`
                            : location.state}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
            {validationErrors.default_location_id && (
              <p className="text-sm text-red-500">
                Default location is required
              </p>
            )}
          </div>

          <Button
            onClick={updateProfile}
            disabled={isLoading || !formValid}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
