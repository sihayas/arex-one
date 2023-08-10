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

// Mimics Apple Music API response with some custom stuff
export interface AlbumData {
  attributes: AlbumAttributes;
  id: string;
  notes: string;
  relationships: AlbumRelationships;
  artworkUrl: string;
  colors: string[];
}

export interface AlbumRelationships {
  tracks: {
    data: [TrackData];
  };
}

export interface AlbumWithRating {
  album: AlbumData;
  averageRating: number | "n/a";
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
}

export interface LikeData {
  authorId: string;
  commentId: string | null;
  createdAt: string;
  id: string;
  reviewId: string | null;
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

export interface ReviewData {
  album: AlbumDBData;
  albumId: string;
  author: {
    id: string;
    image: string;
    name: string;
    username: string;
  };
  content: string | null;
  createdAt: string;
  id: string;
  likedByUser?: boolean;
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

export interface ReviewFormInputs {
  isReReview: boolean;
  listened: boolean;
  loved: boolean;
  rating: number;
  reviewText: string;
}

export interface SelectedAlbumContextType {
  selectedAlbum: AlbumData | null;
  setSelectedAlbum: (album: AlbumData | null) => void;
}

export type OnSelectAlbumCallback = () => void;

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

  notifications: Notification[]; // Assuming a Notification interface is defined elsewhere
}

interface CountData {
  replies: number;
  likes: number;
}
