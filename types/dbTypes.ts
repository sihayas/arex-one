import { AlbumData, SongData } from "@/types/appleTypes";

export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  image: string;
  emailVerified?: string;
  password_hash?: string;
  dateJoined: Date;
  dateUpdated: Date;
  notifications: Notification[];
  essentials: Essential[];
  following: Follows[];
  followers: Follows[];
  record: Record[];
  replies: Reply[];
  hearts: Heart[];
  views: View[];
  settings: Settings;
}

export interface Settings {
  id: string;
  userId: string;
  email: boolean;
  push: boolean;
  isPrivate: boolean;
  isMinus: boolean;
  followerNotifications: boolean;
  replyNotifications: boolean;
  heartNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface Essential {
  id: string;
  userId: string;
  albumId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  album: Album;
  appleAlbumData: AlbumData;
}

export interface Follows {
  id: string;
  followerId: string;
  followingId: string;
  follower: User;
  following: User;
  activities: Activity[];
}

export interface Album {
  id: string;
  appleId: string;
  name: string;
  artist: string;
  releaseDate: string;
  averageRating: number;
  lastUpdated: Date;
  notes?: string;
  tracks: Track[];
  essentials: Essential[];
  record: Record[];
  views: View[];
}

export interface Track {
  id: string;
  appleId: string;
  name: string;
  albumId: string;
  album: Album;
  record: Record[];
}

export interface Record {
  id: string;
  type: RecordType;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  albumId?: string;
  trackId?: string;
  entryId?: string;
  captionId?: string;
  entry?: Entry;
  caption?: Caption;
  author: User;
  album?: Album;
  track?: Track;
  activities: Activity[];
  views: View[];
  hearts: Heart[];
  replies: Reply[];

  appleAlbumData: AlbumData;
  appleTrackData: SongData;
}

export enum RecordType {
  ENTRY = "ENTRY",
  CAPTION = "CAPTION",
}

export interface Entry {
  id: string;
  text: string;
  rating: number;
  loved: boolean;
  replay: boolean;
  record: Record;
}

export interface Caption {
  id: string;
  text?: string;
  media?: string;
  link?: string;
  record: Record;
}

export interface Heart {
  id: string;
  authorId: string;
  recordId?: string;
  replyId?: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  record?: Record;
  reply?: Reply;
  activities: Activity[];
}

export interface Reply {
  id: string;
  content: string;
  rootReplyId?: string;
  replyToId?: string;
  recordId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  rootReply?: Reply;
  replyTo?: Reply;
  record: Record;
  author: User;
  hearts: Heart[];
  replies: Reply[];
  rootReplies: Reply[];
  views: View[];
  activities: Activity[];

  _count: {
    hearts: number;
    replies: number;
    views: number;
  };
  heartedByUser: boolean;
}

export interface Activity {
  id: string;
  type: ActivityType;
  referenceId: string;
  createdAt: Date;
  updatedAt: Date;
  record?: Record;
  heart?: Heart;
  follow?: Follows;
  reply?: Reply;
  notifications: Notification[];
}

export enum ActivityType {
  RECORD = "RECORD",
  HEART = "HEART",
  FOLLOWED_BACK = "FOLLOWED_BACK",
  FOLLOWED = "FOLLOWED",
  REPLY = "REPLY",
}

export interface Notification {
  id: string;
  read: boolean;
  recipient: User;
  recipientId: string;
  activity: Activity;
  activityId: string;
  aggregation_Key: string;
}

export interface View {
  id: string;
  viewType: ViewType;
  referenceId: string;
  user: User;
  userId: string;
  viewedAt: Date;
  record?: Record;
  reply?: Reply;
  album?: Album;
}

export enum ViewType {
  RECORD = "RECORD",
  REPLY = "REPLY",
  ALBUM = "ALBUM",
}
