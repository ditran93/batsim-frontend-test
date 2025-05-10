import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(auth)/_auth/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <Button>Enter Lobby</Button>
    </div>
  );
}
