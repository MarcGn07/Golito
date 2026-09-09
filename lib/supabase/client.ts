import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use inside Client Components ("use client").
 * Reads the two public env vars — safe to expose in the browser,
 * access is still controlled server-side via Row Level Security (RLS).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
