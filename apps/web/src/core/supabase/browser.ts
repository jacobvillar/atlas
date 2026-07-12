import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Uses ONLY the public anon key — never the
// service-role key, which must stay server-side.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
