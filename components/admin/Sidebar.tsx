"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-4m0 0l7-4 7 4M5 8v10a1 1 0 001 1h12a1 1 0 001-1V8m-9 4v4m-4-4v4m8-4v4"
        />
      </svg>
    ),
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4"
        />
      </svg>
    ),
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-6 left-6 z-40 md:hidden p-2 rounded-lg bg-[#E84A2F] text-white"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 bg-[#1A1A1A] border-r border-[#333333] transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } md:w-64 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div
          className={`flex items-center justify-center h-20 border-b border-[#333333] shrink-0 ${
            isCollapsed ? "px-2" : "px-6"
          }`}
        >
          <div
            className={`font-bold text-white ${
              isCollapsed ? "text-sm" : "text-lg"
            }`}
          >
            {isCollapsed ? "TF" : "The Funzo"}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-[#E84A2F] text-white"
                    : "text-[#CCCCCC] hover:bg-[#252525]"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <div>{item.icon}</div>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <div className="hidden md:block p-3 border-t border-[#333333]">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-[#CCCCCC] hover:bg-[#252525] transition-colors"
            aria-label="Collapse sidebar"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
