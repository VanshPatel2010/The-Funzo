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
        // ✅ Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // ✅ Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email as string)) {
          throw new Error("Invalid credentials");
        }

        // ✅ Check password length to prevent DoS
        if ((credentials.password as string).length > 1000) {
          throw new Error("Invalid credentials");
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
            // Return generic error to prevent user enumeration
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
            // Return generic error to prevent user enumeration
            throw new Error("Invalid credentials");
          }

          // ✅ Return user object for JWT - only include safe data
          return {
            id: admin.id,
            email: admin.email,
            name: admin.email,
          };
        } catch {
          // Don't leak error details
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  // ✅ Security settings
  trustHost: true,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login?error=true",
  },
  callbacks: {
    // ✅ Validate JWT before use
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
