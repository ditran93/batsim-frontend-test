import { lobbyApi } from "../api/lobby-api";

export const useLeaveLobby = () => {
  const leaveLobby = async () => {
    try {
      // Call the API to leave the lobby
      await lobbyApi.leaveLobby();
    } catch (error) {
      console.error("Error leaving lobby:", error);
    }
  };

  return { leaveLobby };
};
