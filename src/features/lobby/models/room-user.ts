import type { Character } from "./character";

export interface RoomUser {
  userId: number;
  username: string;
  activeCharacter: Character[];
  defeatedCharacters: Character[];
}
