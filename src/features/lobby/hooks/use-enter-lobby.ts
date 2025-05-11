import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { lobbyApi } from "../api/lobby-api";

export const useEnterLobby = () => {
  const navigate = useNavigate();

  const enterLobby = useMutation({
    mutationFn: () => {
      return lobbyApi.enterLobby();
    },
    onSuccess: () => {
      // Navigate to lobby page on successful API call
      navigate({ to: "/lobby" });
    },
    onError: (error: AxiosError) => {
      console.error("Failed to enter lobby:", error);
      if (error.response?.status === 401) {
        navigate({ to: "/sign-in" });
      }
    },
  });
  return { enterLobby: enterLobby.mutate };
};
