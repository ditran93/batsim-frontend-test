import type { RoomUser } from "./room-user";

export interface RoomResponse {
  creator: { userId: number; username: string };
  id: string;
  name: string;
  players: RoomUser[];
}
