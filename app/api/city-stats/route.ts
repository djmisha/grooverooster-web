import { NextResponse } from "next/server";
import { getAllCityStats } from "@/utils/cityStatsCache";

/**
 * Force dynamic rendering so the handler always reads the live in-memory
 * cache instead of serving a pre-rendered (stale) response.
 */
export const dynamic = "force-dynamic";

/**
 * GET /api/city-stats
 *
 * Returns cached event counts for all cities that have been visited since the
 * last server restart.  The cache is populated gradually as city event pages
 * are rendered — no bulk prefetch is performed.
 *
 * This endpoint is open to the frontend (no bearer token required).
 * Cache-Control is set so browsers / CDN edge nodes cache the response for
 * 24 hours, matching the in-process cache TTL.
 */
export async function GET() {
  const stats = getAllCityStats();

  return NextResponse.json(
    { data: stats },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=172800",
      },
    }
  );
}
