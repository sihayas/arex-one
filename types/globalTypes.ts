import { Artifact } from "@/types/dbTypes";

export interface ArtifactExtended extends Artifact {
  _count: {
    hearts: number;
    replies: number;
  };
  heartedByUser: boolean;
}
