"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Music, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext } from "@/features/AppContext";

interface DashboardOverviewProps {
  profile: any;
  user: any;
  defaultLocation: any;
}

export default function DashboardOverview({
  profile: serverProfile,
  user,
  defaultLocation,
}: DashboardOverviewProps) {
  const { supabase } = useAppContext();
  const [stats, setStats] = useState({
    citiesCount: 0,
    artistsCount: 0,
    recentEvents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!serverProfile?.id) return;

      try {
        // Get user's saved location IDs
        const { data: savedLocationIds } = await supabase
          .from("profiles")
          .select("other_locations, default_location_id")
          .eq("id", serverProfile.id)
          .single();

        const otherLocationIds = savedLocationIds?.other_locations || [];
        const allLocationIds = savedLocationIds?.default_location_id
          ? [savedLocationIds.default_location_id, ...otherLocationIds]
          : otherLocationIds;

        const uniqueLocationIds = Array.from(new Set(allLocationIds));

        // Get favorite artists count
        const { data: favoriteData } = await supabase
          .from("profiles")
          .select("favorite_artists")
          .eq("id", serverProfile.id)
          .single();

        const favoriteArtists = favoriteData?.favorite_artists || [];

        setStats({
          citiesCount: uniqueLocationIds.length,
          artistsCount: favoriteArtists.length,
          recentEvents: 0, // Placeholder for future feature
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [serverProfile, supabase]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mt-[15px] text-[20px] text-blue dark:text-gray-100 font-normal md:mt-[15px] md:block md:text-[30px] text-3xl font-bold tracking-tight">
          {getGreeting()},{" "}
          {serverProfile?.username || user?.email?.split("@")[0] || "there"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your GrooveRooster dashboard. Track your favorite artists
          and cities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/cities">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Cities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.citiesCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.citiesCount === 1 ? "location" : "locations"} tracked
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/artists">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Artists</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.artistsCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.artistsCount === 1 ? "artist" : "artists"} favorited
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">upcoming events</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with managing your music experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/dashboard/cities"
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <div>
                <p className="font-medium">Add Cities</p>
                <p className="text-sm text-muted-foreground">
                  Track events in your favorite locations
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/artists"
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
            >
              <Music className="h-5 w-5" />
              <div>
                <p className="font-medium">Follow Artists</p>
                <p className="text-sm text-muted-foreground">
                  Never miss your favorite DJs and artists
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Default Location Card */}
        {defaultLocation && (
          <Card>
            <CardHeader>
              <CardTitle>Default Location</CardTitle>
              <CardDescription>Your primary city for events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {defaultLocation.city || defaultLocation.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {defaultLocation.state}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
