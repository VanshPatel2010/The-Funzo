import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return (
    <div className="h-screen flex flex-col bg-[#1A1A1A]">
      {/* Top Bar */}
      <TopBar adminEmail={session.user.email} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-20 md:pt-0">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
