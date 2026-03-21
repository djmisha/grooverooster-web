"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CityStatEntry } from "@/utils/cityStatsCache";

interface CityStatsApiResponse {
  data: Record<string, CityStatEntry>;
}

/**
 * CityActivityClient renders a grid of cities that have upcoming events.
 * Data is fetched from /api/city-stats, which is backed by an in-memory cache
 * that is gradually populated as city pages are visited.  The browser will
 * cache the API response for 24 hours (matching the server-side TTL).
 */
const CityActivityClient = () => {
  const [stats, setStats] = useState<Record<string, CityStatEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      try {
        const res = await fetch("/api/city-stats");
        if (res.ok) {
          const json: CityStatsApiResponse = await res.json();
          setStats(json.data || {});
        } else {
          console.error("Error fetching city stats:", res.status);
        }
      } catch (error) {
        console.error("Error fetching city stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Sort cities by event count descending; only show entries with a city name
  // and at least one event.
  const activeCities = Object.entries(stats)
    .filter(([, entry]) => entry.city && entry.count > 0)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 12);

  if (isLoading || activeCities.length === 0) return null;

  return (
    <div className="max-w-[1440] m-auto">
      <h2 className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl px-4">
        Active Event Cities
      </h2>
      <p className="p-4">
        Cities with the most upcoming EDM &amp; house music events, updated as
        you explore.
      </p>
      <ul className="list-none m-0 p-0 pl-3 flex flex-wrap pb-10">
        {activeCities.map(([id, entry]) => (
          <li key={id} className="w-1/2 py-3 md:w-1/4">
            <Link
              href={`/events/${entry.slug}`}
              className="no-underline text-black dark:text-gray-200 hover:text-pink transition-colors duration-200"
            >
              {entry.city}
              <span className="ml-1 text-sm text-pink">({entry.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CityActivityClient;
