export interface ReviewData {
  appleAlbumData: AlbumData;
  album?: AlbumDBData;
  albumId?: string;
  track?: TrackDBData;
  trackId?: string;
  author: {
    id: string;
    image: string;
    name: string;
    username: string;
  };
  content: string | null;
  createdAt: string;
  id: string;
  likedByUser: boolean;
  likes: LikeData[];
  listened: boolean;
  loved: boolean;
  permalink: string;
  published: boolean;
  rating: number;
  replies: ReplyData[];
  updatedAt: string;
  viewsCount: number;

  _count: CountData;
}

export interface AlbumDBData {
  id: string;
  name: string;
  artist: string;
  releaseDate: string;
  averageRating: number | null;
  lastUpdated: Date | null;
  reviews?: ReviewData[];
  notes?: string | null;
  viewsCount: number;
  listenedCount: number;
  ratingsCount: number;
  lovedCount: number;

  tracks?: TrackData[];
}

export interface TrackDBData {
  id: string;
  name: string;
  album: AlbumDBData;
  albumId: string;
  duration: number;
  reviews?: ReviewData[];
}

export interface SelectedSound {
  sound: AlbumData | SongData;
  artworkUrl: string;
  colors: string[];
}

// Apple Music API response
export interface AlbumData {
  attributes: AlbumAttributes;
  id: string;
  notes: string;
  relationships: AlbumRelationships;
  type: string;
}

// Apple Music API response
export interface AlbumAttributes {
  artistName: string;
  artwork: {
    bgColor: string;
    textColor1: string;
    textColor2: string;
    textColor3: string;
    textColor4: string;
    url: string;
  };
  copyright: string;
  dominantColor: string;
  editorialNotes: {
    short: string;
    standard: string;
  };
  genreNames: [string];
  isCompilation: boolean;
  isComplete: boolean;
  isMasteredForItunes: boolean;
  isSingle: boolean;
  name: string;
  playParams: {
    id: string;
    kind: string;
  };
  recordLabel: string;
  releaseDate: string;
  trackCount: number;
  url: string;
}

// Apple Music API response
export interface AlbumRelationships {
  tracks: {
    data: [TrackData];
  };
}

export interface SongData {
  attributes: SongAttributes;
  href: string;
  id: string;
  type: string;
}

export interface SongAttributes {
  albumName: string;
  artistName: string;
  artwork: {
    bgColor: string;
    textColor1: string;
    textColor2: string;
    textColor3: string;
    textColor4: string;
    url: string;
  };
  composerName: string;
  contentRating: string;
  discNumber: number;
  durationInMillis: number;
  genreNames: [string];
  hasCredits: boolean;
  hasLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isrc: string;
  name: string;
  playParams: {
    id: string;
    kind: string;
  };
  releaseDate: string;
  trackNumber: number;
  url: string;
}

// Apple Music API response
export interface TrackData {
  attributes: {
    durationInMillis: number;
    hasLyrics: boolean;
    isAppleDigitalMaster: boolean;
    isrc: string;
    name: string;
    releaseDate: string;
    trackNumber: number;
    url: string;
  };
  href: string;
  id: string;
  type: string;
}

export interface LikeData {
  id: string;
  author: UserData;
  authorId: string;
  reply: ReplyData | null;
  replyId: string | null;
  review: ReviewData | null;
  reviewId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReplyData {
  author: UserData;
  authorId: string;
  content: string;
  createdAt: string;
  id: string;
  likes: LikeData[];
  review: ReviewData | null;
  reviewId: string;
  replies?: ReplyData[];
  replyTo?: ReplyData | null;
  replyToId?: string;
  updatedAt: string;
  likedByUser: boolean;
  rootReplyId?: string;
  rootReply?: ReplyData | null;
  repliesCount?: number;
}

export interface ReviewFormInputs {
  isReReview: boolean;
  listened: boolean;
  loved: boolean;
  rating: number;
  reviewText: string;
}

export interface SelectedAlbumContextType {
  selectedSound: AlbumData | null;
  setSelectedSound: (album: AlbumData | null) => void;
}

export type OnSelectAlbumCallback = () => void;

export interface UserData {
  dateJoined: string;
  dateUpdated: string;
  email: string;
  emailVerified?: string;
  id: string;
  image?: string;
  likes?: LikeData[];
  name?: string;
  password?: string;
  replies?: ReplyData[];
  reviews?: ReviewData[];
  username?: string;
  bio?: string;
}

export interface ActivityData {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  review?: ReviewData;
  reviewId?: string;
  like?: LikeData;
  likeId?: string;
  reply?: ReplyData;
  replyId?: string;
  follow?: Follows;
  followId?: string;

  notifications: Notification[];
}

interface CountData {
  replies: number;
  likes: number;
}

export interface Notification {
  id: string;
  read: boolean;
  recipientId: string;
  activityId: string;
  activity: ActivityData;
}

export interface Follows {
  activities: ActivityData[];
  id: string;
  follower: UserData;
  followerId: string;
  following: UserData;
  followingId: string;
  createdAt: string;
}
