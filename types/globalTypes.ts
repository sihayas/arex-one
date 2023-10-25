import { AlbumData, SongData } from "@/types/appleTypes";
import { Record } from "@/types/dbTypes";

export interface RecordExtended extends Record {
  appleAlbumData: AlbumData;
  _count: {
    hearts: number;
    replies: number;
  };
  heartedByUser: boolean;
}
