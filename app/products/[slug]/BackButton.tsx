"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#E84A2F] hover:text-[#D63A1F] transition-colors group"
    >
      <svg
        className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      Back
    </button>
  );
}
