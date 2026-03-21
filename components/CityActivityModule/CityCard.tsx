"use client";

import Link from "next/link";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaRecycle,
  FaUsers,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CityStats } from "@/utils/cityStats";

interface CityCardProps {
  stats: CityStats;
  rank: number;
}

/**
 * Stat row displayed inside each city card.
 */
const StatRow = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) => (
  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
    <span className="text-gray-400 dark:text-gray-500 w-4 flex-shrink-0">
      {icon}
    </span>
    <span className="font-semibold text-gray-800 dark:text-gray-200 min-w-[2rem] text-right tabular-nums">
      {value.toLocaleString()}
    </span>
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
  </div>
);

/**
 * CityCard — displays activity statistics for a single city using a ShadCN Card.
 *
 * NOTE: City imagery is not included in this version.  A future enhancement
 * could source iconic city images from an open resource such as Unsplash
 * (https://unsplash.com/developers) or Wikimedia Commons and link to them
 * directly.  The image could be placed above the CardHeader as a fixed-height
 * hero strip inside the card.
 */
const CityCard = ({ stats, rank }: CityCardProps) => {
  const { city, state, slug, shows, artists, venues, festivals, series } =
    stats;

  return (
    <Link
      href={`/events/${slug}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 rounded-xl"
      aria-label={`View events in ${city}, ${state}`}
    >
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-tight truncate">
                {city}
              </CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {state}
              </p>
            </div>
            {/* Activity rank badge */}
            <span
              className="flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink/10 text-pink text-xs font-bold"
              aria-label={`Rank ${rank}`}
            >
              #{rank}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-2">
          <StatRow
            icon={<FaCalendarAlt />}
            value={shows}
            label={shows === 1 ? "Show" : "Shows"}
          />
          <StatRow
            icon={<FaMapMarkerAlt />}
            value={venues}
            label={venues === 1 ? "Venue" : "Venues"}
          />
          <StatRow
            icon={<FaUser />}
            value={artists}
            label={artists === 1 ? "Artist" : "Artists"}
          />
          <StatRow
            icon={<FaUsers />}
            value={festivals}
            label={festivals === 1 ? "Festival" : "Festivals"}
          />
          <StatRow icon={<FaRecycle />} value={series} label="Series" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default CityCard;
