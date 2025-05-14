import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(auth)/_auth/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const handleEnterLobby = () => {
    navigate({ to: "/lobby" });
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClick={handleEnterLobby}>Enter Lobby</Button>
    </div>
  );
}
