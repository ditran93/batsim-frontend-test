import { axiosInstance } from "@/lib/axios-config";

export interface LobbyUser {
  userId: number;
  username: string;
}

export const lobbyApi = {
  // HTTP endpoint to tell the server you're entering the lobby
  enterLobby: async (): Promise<void> => {
    await axiosInstance.post("/lobby/enter");
  },

  // HTTP endpoint to tell the server you're leaving the lobby
  leaveLobby: async (): Promise<void> => {
    await axiosInstance.post("/lobby/leave");
  },
};
