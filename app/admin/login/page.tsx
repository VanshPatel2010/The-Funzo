"use client";

import { Suspense, FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setPassword("");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            The Funzo Admin
          </h1>
          <p className="text-secondary-300">
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100/60"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Info */}
        <p className="text-center text-xs text-secondary-300 mt-6">
          Admin login only. Contact your administrator for access.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-accent-100" />}>
      <AdminLoginContent />
    </Suspense>
  );
}
