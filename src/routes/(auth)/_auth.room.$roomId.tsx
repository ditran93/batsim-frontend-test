import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useGetRoomById } from "@/features/lobby/hooks/use-get-room-by-id";
import type { LeaveRoomRequest } from "@/features/lobby/models/leave-room-request";
import { Client } from "@stomp/stompjs";

import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/_auth/room/$roomId")({
  component: RoomIdPage,
});

function RoomIdPage() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams({
    from: "/(auth)/_auth/room/$roomId",
  });
  const { data: roomDetails, isLoading: isRoomLoading } = useGetRoomById({
    id: roomId,
  });

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to game rooms socket");

        // Subscribe to lobby updates
        client.subscribe("/topic/room/" + roomId, (message) => {
          const data = JSON.parse(message.body);
          console.log("Received room update:", data);
        });
      },
    });

    client.activate();
    setStompClient(client);
  }, []);

  const handleLeaveRoom = (request: LeaveRoomRequest) => {
    // Logic to leave the room
    console.log("Leaving room with ID:", roomId);
    if (!stompClient) return;

    // Send WebSocket message to join room
    stompClient.publish({
      destination: "/app/room/leave",
      body: JSON.stringify(request),
    });

    // Navigate to the room page
    navigate({
      to: "/lobby",
    });

    toast.success(`Leaving room: ${request.roomId}`);
  };

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      {isRoomLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Room Details</h2>
          <p>Name: {roomDetails?.name}</p>
          <p>Players: {roomDetails?.players.length}</p>
          <p>Creator: {roomDetails?.creator.username}</p>
          <p>Status: {"Waiting"}</p>
        </div>
      )}
      <Button
        onClick={() => {
          if (user) {
            handleLeaveRoom({ roomId: roomId, userId: user?.id.toString() });
          }
        }}
      >
        Leave Room
      </Button>
    </div>
  );
}
