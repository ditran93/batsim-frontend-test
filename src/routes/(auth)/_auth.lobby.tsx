import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useGetLobbyData } from "@/features/lobby/hooks/use-get-lobby-data";
import { useLeaveLobby } from "@/features/lobby/hooks/use-leave-lobby";

export const Route = createFileRoute("/(auth)/_auth/lobby")({
  component: LobbyPage,
});

function LobbyPage() {
  const { onlineUsers, isLoading } = useGetLobbyData();
  const { leaveLobby } = useLeaveLobby();
  const navigate = useNavigate();

  const handleLeaveLobby = () => {
    leaveLobby();
    navigate({ to: "/" });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Game Lobby</h1>

      {isLoading ? (
        <div>Connecting to lobby...</div>
      ) : (
        <div className="border rounded-md p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Online Players ({onlineUsers?.length})
          </h2>
          <ul className="space-y-2">
            {onlineUsers &&
              onlineUsers.map((user) => (
                <li
                  key={user.userId}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="font-medium">{user.username}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      <Button onClick={handleLeaveLobby}>Back to Home</Button>
    </div>
  );
}
