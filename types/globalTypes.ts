import { Entry } from "@/types/dbTypes";

export interface EntryExtended extends Entry {
  _count: {
    hearts: number;
    replies: number;
  };
  heartedByUser: boolean;
}
