import { AlbumData, SongData } from "@/types/appleTypes";
import { Record } from "@/types/dbTypes";

export interface RecordExtended extends Record {
  appleAlbumData: AlbumData;
  _count: {
    likes: number;
    replies: number;
  };
  likedByUser: boolean;
}
