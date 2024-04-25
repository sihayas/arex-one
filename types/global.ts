import { Entry, Essential, Sound } from "@prisma/client";
import { AlbumData, SongData } from "@/types/apple";

// apple sound data stored in cache
export type SoundData = {
  id: string;
  type: string;
  name: string;
  artist_name: string;
  release_date: string;
  artwork_url: string;
  artwork_width: number;
  artwork_height: number;
  artwork_bgColor: string;
  identifier: string;
};

// bare author stored in cache
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
  sound_data: SoundData;
  heartedByUser: boolean;
  actions_count: number;
  chains_count: number;
  author: Author;
};

export type EssentialExtended = Essential & {
  sound: Sound;
  sound_data: SoundData;
};
