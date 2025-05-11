import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Helper function to create a configured STOMP client
export const createStompClient = (url: string): Client => {
  const socket = new SockJS(url);
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  return client;
};
