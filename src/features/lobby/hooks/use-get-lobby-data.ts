import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import { type LobbyUser } from "../api/lobby-api";

import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import SockJS from "sockjs-client";
import axios from "axios";

export const useGetLobbyData = () => {
  // State to store online users
  const [onlineUsers, setOnlineUsers] = useState<LobbyUser[] | null>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { data: initialUsers } = useQuery({
    queryKey: ["lobbyUsers"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/battlesimulator/api/lobby/users",
          {
            withCredentials: true,
          }
        );
        return res.data;
      } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
          navigate({ to: "/sign-in" });
        }
        throw error;
      }
    },
  });

  useEffect(() => {
    if (initialUsers) {
      setOnlineUsers(initialUsers);
      setIsLoading(false);
    }
  }, [initialUsers]);

  useEffect(() => {
    // Create SockJS connection
    const socket = new SockJS(
      "http://localhost:8080/battlesimulator/api/ws-connect"
    );

    // Create and configure STOMP client
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket!");

        // Subscribe to lobby updates
        client.subscribe("/topic/lobby", (message) => {
          // Parse the message body and update state
          const users = JSON.parse(message.body);
          console.log("Received lobby update:", users);
          setOnlineUsers(users);
        });
      },
    });

    // Activate the connection
    client.activate();
    setStompClient(client);

    // Cleanup when component unmounts
    return () => {
      if (stompClient && stompClient.connected) {
        // Tell the server you're leaving
        client.publish({ destination: "/app/lobby/leave" });
        client.deactivate();
      }
    };
  }, []);

  return {
    onlineUsers, // List of online users
    isLoading, // Loading state
  };
};
