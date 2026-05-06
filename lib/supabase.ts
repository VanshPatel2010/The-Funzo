import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Browser / Client-Side Supabase Client ──────────────────────────────────
// Uses the anon key — safe to expose in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Guard: only create the client if env vars are present
// This prevents build-time errors when .env.local is not yet configured

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a dummy client to avoid import errors during build
  // Any actual usage will fail at runtime with a clear error
  supabase = new Proxy({} as SupabaseClient, {
    get(_, prop) {
      if (prop === "then") return undefined; // prevent Promise-like behavior
      return () => {
        throw new Error(
          "Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
        );
      };
    },
  });
}

export { supabase };

// ─── Server-Side Supabase Client (Admin) ────────────────────────────────────
// Uses the service role key — NEVER expose to the browser.
// Only import this in server components, API routes, or server actions.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
