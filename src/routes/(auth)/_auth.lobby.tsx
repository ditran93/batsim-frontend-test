import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Room } from "@/features/lobby/models/room";

import { useGetAllRooms } from "@/features/lobby/hooks/use-get-all-rooms";
import type { JoinRoomRequest } from "@/features/lobby/models/join-room-request";
import type { RoomResponse } from "@/features/lobby/models/room-response";

export const Route = createFileRoute("/(auth)/_auth/lobby")({
  component: LobbyPage,
});

function LobbyPage() {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [gameRooms, setGameRooms] = useState<Room[]>([]);

  const { rooms: initialGameRooms } = useGetAllRooms();

  useEffect(() => {
    if (initialGameRooms) {
      const rooms: Room[] = initialGameRooms.map((room: RoomResponse) => ({
        id: room.id,
        name: room.name,
        players: room.players,
        status: "Waiting",
        creator: room.creator.username,
      }));

      setGameRooms(rooms);
    }
  }, [initialGameRooms]);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to game rooms socket");

        // Subscribe to lobby updates
        client.subscribe("/topic/rooms", (message) => {
          const data = JSON.parse(message.body);
          console.log("Received lobby update:", data);

          // Update game rooms if the data contains them
          if (data) {
            console.log("Game rooms updated:", data);
            const rooms: Room[] = data.map((room: RoomResponse) => ({
              id: room.id,
              name: room.name,
              players: room.players,
              status: "Waiting",
              creator: room.creator.username,
            }));

            setGameRooms(rooms);
          }
        });
      },
    });

    client.activate();
    setStompClient(client);
  }, []);

  const handleJoinRoom = (request: JoinRoomRequest) => {
    if (!stompClient) return;

    // Send WebSocket message to join room
    stompClient.publish({
      destination: "/app/room/join",
      body: JSON.stringify(request),
    });

    // Navigate to the room page
    navigate({
      to: "/room/$roomId",
      params: {
        roomId: request.roomId,
      },
    });

    toast.success(`Joining room: ${request.roomId}`);
  };

  const getRoomIdByCreatorUsername = (creatorUsername: string) => {
    const room = gameRooms.find((room) => room.creator === creatorUsername);
    return room ? room.id : null;
  };

  const handleCreateRoom = () => {
    if (!stompClient || !roomName.trim() || !user?.username) return;

    // Send WebSocket message to create room
    stompClient.publish({
      destination: "/app/room/create",
      body: JSON.stringify({
        roomName: roomName,
        userId: user?.id,
        username: user?.username,
      }),
    });

    toast.success(`Creating room: ${roomName}`);
    setRoomName(""); // Clear input after submission
    const roomId = getRoomIdByCreatorUsername(user.username);
    if (roomId) {
      console.log("Navigating to room:", roomId);
      navigate({
        to: "/room/$roomId",
        params: {
          roomId: roomId.toString(),
        },
      });
    }
  };

  const handleLeaveLobby = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleLeaveLobby} variant="outline">
          Exit Lobby
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Game Rooms Section */}
        <div>
          {/* Create Game Button */}
          <div className="flex justify-end items-center mb-4 gap-3">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={!roomName.trim() || !stompClient}
              onClick={handleCreateRoom}
            >
              Create Game Room
            </Button>
          </div>

          {/* Game Rooms List */}
          <div className="border rounded-md p-4">
            <h2 className="text-xl font-semibold mb-4">Game Rooms</h2>

            {gameRooms.length === 0 ? (
              <p className="text-center text-gray-500 my-8">
                No game rooms available. Create one to start playing!
              </p>
            ) : (
              <div className="grid gap-4">
                {gameRooms.map((room, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{room.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          room.status === "Playing"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Players: {room.players.length}/2
                    </div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (user?.id) {
                            handleJoinRoom({
                              roomId: room.id,
                              userId: user?.id.toString(),
                              username: user?.username,
                            });
                          }
                        }}
                      >
                        Join Game
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
