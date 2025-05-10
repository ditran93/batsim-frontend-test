import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const Route = createFileRoute("/(public)/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex items-center h-screen justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Outlet />
    </div>
  );
}
