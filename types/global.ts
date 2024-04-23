import { Entry, Essential, Sound } from "@prisma/client";
import { AlbumData, SongData } from "@/types/apple";

// Bare author stored in cache
export type Author = {
  id: string;
  image: string;
  username: string;
  bio: string;
  essentials: string;
  _count: string;
};

export type EntryExtended = Entry & {
  sound_id: string;
  sound_apple_id: string;
  sound_type: string;
  sound_data: AlbumData | SongData;
  heartedByUser: boolean;
  actions_count: number;
  chains_count: number;
  author: Author;
};

export type EssentialExtended = Essential & {
  sound: Sound;
  sound_data: AlbumData;
};
