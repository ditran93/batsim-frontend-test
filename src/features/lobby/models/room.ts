import type { RoomUser } from "./room-user";

export interface Room {
  id: string;
  name: string;
  players: RoomUser[];
  creator: string;
  status: "Waiting" | "Playing";
}
