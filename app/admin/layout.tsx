// This layout is intentionally empty - login page doesn't need protection
// Protected routes are wrapped by (protected)/layout.tsx

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
