import { AlbumData } from "@/types/appleTypes";
import { Artifact } from "@/types/dbTypes";

export interface ArtifactExtended extends Artifact {
  appleAlbumData: AlbumData;
  _count: {
    hearts: number;
    replies: number;
  };
  heartedByUser: boolean;
}
