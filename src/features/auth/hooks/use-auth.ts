import { axiosInstance } from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";
import type { Auth } from "../models/auth";
import { AxiosError } from "axios";

export const useAuth = () => {
  return useQuery<Auth | null, Error>({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const resp = await axiosInstance.get("/auth");
        return resp.data;
      } catch (error) {
        console.error("Error fetching auth data:", error);
        if (error instanceof AxiosError) {
          console.error("Axios error:", error.response?.data);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error; // Rethrow to maintain query error state
      }
    },
  });
};
