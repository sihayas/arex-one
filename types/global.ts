import { Entry } from "@prisma/client";
import { AlbumData, SongData } from "@/types/appleTypes";

export type EntryExtended = Entry & {
  sound_id: string;
  sound_apple_id: string;
  sound_type: string;
  sound_data: AlbumData | SongData;
  heartedByUser: boolean;
  actions_count: number;
  chains_count: number;
  author: {
    id: string;
    image: string;
    username: string;
    bio: string;
    essentials: string;
    _count: string;
  };
};

// Bare author stored in cache
export interface Author {
  id: string;
  image: string;
  username: string;
  bio: string;
  essentials: string;
  _count: string;
}
