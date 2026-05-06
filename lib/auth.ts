import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createAdminClient } from "@/lib/supabase";

// ─── NextAuth v5 Configuration ──────────────────────────────────────────────

const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@thefunzo.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const adminClient = createAdminClient();

          // Fetch admin by email
          const { data: admin, error: adminError } = await adminClient
            .from("admins")
            .select("id, email")
            .eq("email", credentials.email as string)
            .single();

          if (adminError || !admin) {
            throw new Error("Invalid credentials");
          }

          // Fetch stored password hash
          const { data: creds, error: credsError } = await adminClient
            .from("admin_credentials")
            .select("password_hash")
            .eq("admin_id", admin.id)
            .single();

          if (credsError || !creds) {
            throw new Error("Invalid credentials");
          }

          // Compare password with hash
          const passwordMatch = await compare(
            credentials.password as string,
            creds.password_hash
          );

          if (!passwordMatch) {
            throw new Error("Invalid credentials");
          }

          // Return user object for JWT
          return {
            id: admin.id,
            email: admin.email,
            name: admin.email,
          };
        } catch {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  trustHost: true,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
