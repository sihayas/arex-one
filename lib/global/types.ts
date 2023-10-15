export interface User {
  id: string;
  email: string;
  username?: string;
  name: string;
  bio?: string;
  image?: string;
  emailVerified?: string;
  password?: string;
  dateJoined: Date;
  dateUpdated: Date;
  notifications: Notification[];
  favorites: Favorite[];
  following: Follows[];
  followers: Follows[];
  record: Record[];
  replies: Reply[];
  likes: Like[];
  accounts: Account[];
  sessions: Session[];
  views: View[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  oauth_token_secret?: string;
  oauth_token?: string;
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

export interface VerificationToken {
  id: number;
  identifier: string;
  token: string;
  expires: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  albumId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  album: Album;
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
  name: string;
  artist: string;
  releaseDate: string;
  averageRating: number;
  lastUpdated: Date;
  notes?: string;
  tracks: Track[];
  favorites: Favorite[];
  record: Record[];
  views: View[];
}

export interface Track {
  id: string;
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
  likes: Like[];
  replies: Reply[];
}

export enum RecordType {
  ENTRY,
  CAPTION,
}

export interface Entry {
  id: string;
  text: string;
  rating: number;
  record: Record;
}

export interface Caption {
  id: string;
  text?: string;
  media?: string;
  link?: string;
  record: Record;
}

export interface Like {
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
  likes: Like[];
  replies: Reply[];
  rootReplies: Reply[];
  views: View[];
  activities: Activity[];
}

export interface Activity {
  id: string;
  viewType: ViewType;
  referenceId: string;
  createdAt: Date;
  updatedAt: Date;
  record?: Record;
  like?: Like;
  follow?: Follows;
  reply?: Reply;
  notifications: Notification[];
}

export enum ActivityType {
  RECORD,
  LIKE,
  FOLLOW,
  REPLY,
}

export interface Notification {
  id: string;
  read: boolean;
  recipient: User;
  recipientId: string;
  activity: Activity;
  activityId: string;
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
  RECORD,
  REPLY,
  ALBUM,
}
