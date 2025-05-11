import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import { useEnterLobby } from "@/features/lobby/hooks/use-enter-lobby";

export const Route = createFileRoute("/(auth)/_auth/")({
  component: Index,
});

function Index() {
  const { enterLobby } = useEnterLobby();

  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClick={() => enterLobby()}>Enter Lobby</Button>
    </div>
  );
}
