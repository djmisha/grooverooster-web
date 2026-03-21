"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import CityCard from "@/components/CityActivityModule/CityCard";
import { CityStats } from "@/utils/cityStats";

/** Sort options available to the user */
export type SortKey =
  | "score"
  | "shows"
  | "venues"
  | "artists"
  | "festivals"
  | "series";

interface SortOption {
  key: SortKey;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: "score", label: "Most Active" },
  { key: "shows", label: "Most Shows" },
  { key: "venues", label: "Most Venues" },
  { key: "artists", label: "Most Artists" },
  { key: "festivals", label: "Most Festivals" },
  { key: "series", label: "Most Series" },
];

/**
 * CityActivityClient
 *
 * Client component that:
 *  1. Fetches city stats from /api/city-stats on mount.
 *  2. Provides interactive sort controls.
 *  3. Renders a responsive grid of CityCard components.
 */
const CityActivityClient = () => {
  const [allStats, setAllStats] = useState<CityStats[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    try {
      // Use relative URL so the request goes to the current origin ('self')
      // and is not blocked by the Content Security Policy connect-src directive
      const res = await fetch("/api/city-stats");

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setAllStats(json.data || []);
    } catch (err) {
      console.error("[CityActivityClient] Failed to fetch city stats:", err);
      setError("Could not load city activity data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const sorted = useMemo<CityStats[]>(() => {
    return [...allStats].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [allStats, sortKey]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12" aria-live="polite">
        <span className="text-gray-400 text-sm animate-pulse">
          Loading city activity…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center text-sm text-gray-400" role="alert">
        {error}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">
        City activity data will appear here once event pages have been visited.
      </div>
    );
  }

  return (
    <div>
      {/* Sort controls */}
      <div
        className="flex flex-wrap gap-2 mb-6"
        role="group"
        aria-label="Sort cities by"
      >
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setSortKey(option.key)}
            aria-pressed={sortKey === option.key}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-1 ${
              sortKey === option.key
                ? "bg-blue text-white border-blue"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-border-grey dark:border-gray-600 hover:border-blue hover:text-blue"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* City cards grid */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
        aria-label={`Cities sorted by ${SORT_OPTIONS.find((o) => o.key === sortKey)?.label}`}
      >
        {sorted.map((stats, index) => (
          <div key={stats.slug} role="listitem">
            <CityCard stats={stats} rank={index + 1} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityActivityClient;
