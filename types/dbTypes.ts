import { AlbumData, SongData } from "@/types/appleTypes";

export interface UserType {
  id: string;
  email: string;
  username: string;
  bio?: string;
  image: string;
  emailVerified: boolean;
  password_hash?: string;
  dateJoined: Date;
  dateUpdated: Date;
  lastLogin?: Date;
  lastActive?: Date;
  isBanned: boolean;
  isDeleted: boolean;
  isSuspended: boolean;
  following: Follows[];
  followedBy: Follows[];
  essentials: Essential[];
  notifications: Notification[];
  entry: Entry[];
  replies: ReplyType[];
  hearts: Heart[];
  views: View[];
  settings?: Settings;
}

export interface Settings {
  id: string;
  userId: string;
  email: boolean;
  push: boolean;
  isPrivate: boolean;
  isMinus: boolean;
  followNotifications: boolean;
  replyNotifications: boolean;
  heartNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
}

export interface Essential {
  id: string;
  userId: string;
  soundId: string;
  rank?: number;
  user: UserType;
  sound: Sound;
  createdAt: Date;
  updatedAt: Date;
  appleData: AlbumData;
}

export interface Follows {
  id: string;
  followerId: string;
  followingId: string;
  follower: UserType;
  following: UserType;
  activities: Activity[];
  isDeleted: boolean;
}

export enum SoundType {
  Albums = "albums",
  Songs = "songs",
}

export interface Sound {
  id: string;
  appleId: string;
  type: SoundType;
  rating: number;
  attributes: Attributes;
  attributesId: string;
  albumId?: string;
  album?: Sound;
  songs: Sound[];
  essentials: Essential[];
  entry: Entry[];
  metrics: Metrics[];
  createdAt: Date;
  updatedAt: Date;

  appleData: AlbumData | SongData;
}

export interface Attributes {
  id: string;
  name: string;
  artistName: string;
  releaseDate: string;
  albumName?: string;
  sound: Sound[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Metrics {
  id: string;
  soundId: string;
  views: View[];
  sound: Sound;
  createdAt: Date;
  updatedAt: Date;
}

export interface View {
  id: string;
  user: UserType;
  userId: string;
  viewedAt: Date;
  metrics: Metrics[];
}

export enum EntryType {
  Artifact = "artifact",
  Wisp = "wisp",
}

export interface Entry {
  id: string;
  type: EntryType;
  authorId: string;
  soundId: string;
  sound: Sound;
  author: UserType;
  hearts: Heart[];
  replies: ReplyType[];
  content?: Content;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  activities: Activity[];
  appleData: AlbumData | SongData;
  _count: {
    hearts: number;
    replies: number;
  };
}

export interface Content {
  id: string;
  text: string;
  rating?: number;
  loved?: boolean;
  replay?: boolean;
  entry: Entry;
  entryId: string;
}

export interface Heart {
  id: string;
  authorId: string;
  entryId?: string;
  replyId?: string;
  author: UserType;
  entry?: Entry;
  reply?: ReplyType;
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface ReplyType {
  id: string;
  text: string;
  rootId?: string;
  replyToId?: string;
  entryId: string;
  authorId: string;
  isDeleted: boolean;
  replyTo?: ReplyType;
  entry: Entry;
  author: UserType;
  replies: ReplyType[];
  hearts: Heart[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
  _count: {
    hearts: number;
    replies: number;
  };
  heartedByUser: boolean;
}

export interface Activity {
  id: string;
  type: ActivityType;
  referenceId: string;
  createdAt: Date;
  updatedAt: Date;
  entry?: Entry;
  heart?: Heart;
  follow?: Follows;
  reply?: ReplyType;
  isDeleted: boolean;
  notifications: Notification[];
}

export enum ActivityType {
  Entry = "entry",
  Heart = "heart",
  Follow = "follow",
  ReplyType = "reply",
}

export interface Notification {
  id: string;
  recipient: UserType;
  recipientId: string;
  activity: Activity;
  activityId: string;
  key?: string;
  isDeleted: boolean;
}
