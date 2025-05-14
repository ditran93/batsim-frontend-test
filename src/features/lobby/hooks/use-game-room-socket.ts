import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { Room } from "../models/room";

export function useGameRoomsSocket() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [gameRooms, setGameRooms] = useState<Room[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-connect`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to game rooms socket");
        setIsConnected(true);

        // Subscribe to lobby updates
        client.subscribe("/topic/rooms", (message) => {
          const data = JSON.parse(message.body);
          console.log("Received lobby update:", data);

          // Update game rooms if the data contains them
          if (data) {
            console.log("Game rooms updated:", data);
            const rooms: Room[] = data.map((room: any) => ({
              id: room.id,
              name: room.name,
              players: room.players?.length || 0,
              status: "Waiting",
              creator: room.creator?.username || "Unknown",
            }));

            setGameRooms(rooms);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log("Disconnected from game rooms socket");
      },
    });

    client.activate();
    setStompClient(client);

    // Cleanup on unmount
    return () => {
      if (client && client.connected) {
        console.log("Cleaning up WebSocket connection");
        client.deactivate();
      }
    };
  }, []);

  return {
    stompClient,
    gameRooms,
    isConnected,
  };
}
