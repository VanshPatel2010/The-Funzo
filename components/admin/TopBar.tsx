import { signOut } from "@/lib/auth";

interface TopBarProps {
  adminEmail: string;
}

export function TopBar({ adminEmail }: TopBarProps) {
  async function handleSignOut() {
    "use server";
    await signOut();
  }

  return (
    <header className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-20">
      <div className="h-20 px-6 md:px-8 flex items-center justify-between">
        {/* Left side - Empty for now */}
        <div className="hidden md:block" />

        {/* Right side - Admin info and sign out */}
        <div className="flex items-center gap-6 ml-20 md:ml-0">
          {/* Admin Email */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E84A2F]/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#E84A2F]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-[#999999] uppercase tracking-wide">
                Admin
              </p>
              <p className="text-sm font-medium text-white truncate">
                {adminEmail}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <form action={handleSignOut}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E84A2F] text-white text-sm font-semibold hover:bg-[#D63A1F] transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
