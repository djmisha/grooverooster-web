import { type GetServerSidePropsContext } from "next";
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";

/**
 * Creates a Supabase server client for getServerSideProps with cookie handling
 * @param {GetServerSidePropsContext} context - Next.js server-side props context containing req and res
 * @returns {Object} Supabase server client instance
 */
export function createClient({ req, res }: GetServerSidePropsContext) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({
            name,
            value: req.cookies[name] || "",
          }));
        },
        setAll(cookiesToSet) {
          res.setHeader(
            "Set-Cookie",
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  return supabase;
}
