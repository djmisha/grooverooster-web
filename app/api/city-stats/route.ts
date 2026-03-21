import { NextResponse } from "next/server";
import { getCachedCityStats } from "@/utils/cityStatsCache";

/**
 * GET /api/city-stats
 *
 * Returns all currently cached city activity statistics, sorted from most
 * active to least active.  This endpoint is open to the frontend — no bearer
 * token required — because the data it exposes is already public (derived from
 * publicly visible events pages).
 *
 * The data is populated by the events pages when they process events for a
 * given city.  If no cities have been visited yet (e.g. a fresh cold start)
 * the response will contain an empty array.
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
    const stats = getCachedCityStats();

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
