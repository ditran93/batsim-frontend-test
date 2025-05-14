import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex items-center h-screen justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Outlet />
    </div>
  );
}
