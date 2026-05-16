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
// Uses a singleton pattern to avoid creating new clients on every call,
// which is critical for dev mode performance with HMR.

// Store the admin client on globalThis to survive HMR in dev mode
const globalForSupabase = globalThis as unknown as {
  supabaseAdmin: SupabaseClient | undefined;
};

export function createAdminClient(): SupabaseClient {
  if (globalForSupabase.supabaseAdmin) {
    return globalForSupabase.supabaseAdmin;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local"
    );
  }

  const client = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Cache the client in dev mode to avoid re-creating on every HMR
  if (process.env.NODE_ENV !== "production") {
    globalForSupabase.supabaseAdmin = client;
  }

  return client;
}
