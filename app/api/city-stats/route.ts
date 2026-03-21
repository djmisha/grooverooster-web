import { NextResponse } from "next/server";
import {
  getCachedCityStats,
  populateCacheFromAPI,
} from "@/utils/cityStatsCache";

/**
 * GET /api/city-stats
 *
 * Returns all currently cached city activity statistics, sorted from most
 * active to least active.  This endpoint is open to the frontend — no bearer
 * token required — because the data it exposes is already public (derived from
 * publicly visible events pages).
 *
 * Self-populating:
 * On Vercel serverless every function instance has its own in-memory cache.
 * If the cache is empty (cold start) the route fetches events for all known
 * city locations directly from the external SDHM API, computes stats in
 * parallel, and caches the results before responding.  Subsequent requests
 * within the same warm instance are served from memory.
 *
 * Cache behaviour:
 * - City stats entries expire after 24 hours server-side.
 * - The HTTP response is cached for 5 minutes (stale-while-revalidate 60 min)
 *   so the homepage does not re-render this API on every single visit.
 */

// Force dynamic to ensure we always read from the live in-process cache
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check in-memory cache first
    let stats = getCachedCityStats();

    // If cache is empty, populate it from the external SDHM API
    if (stats.length === 0) {
      await populateCacheFromAPI();
      stats = getCachedCityStats();
    }

    return NextResponse.json(
      {
        success: true,
        data: stats,
        count: stats.length,
        generatedAt: new Date().toISOString(),
      },
      {
        headers: {
          // Short public cache: 5 min fresh, 60 min stale-while-revalidate
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[city-stats] Error returning city stats:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}
