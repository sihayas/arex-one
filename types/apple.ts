export interface AlbumData {
  attributes: AlbumAttributes;
  id: string;
  relationships: AlbumRelationships;
  type: string;
  href: string;
}

export interface AlbumAttributes {
  artistName: string;
  artwork: {
    width: number;
    height: number;
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
  upc: string;
}

export interface AlbumRelationships {
  tracks: {
    data: [SongData];
  };
}

export interface SongData {
  attributes: SongAttributes;
  href: string;
  id: string;
  type: string;
  relationships: SongRelationships;
}

export interface SongRelationships {
  albums: {
    data: [AlbumData];
  };
  artists: {
    data: [ArtistData];
  };
}

export interface SongAttributes {
  albumName: string;
  artistName: string;
  artwork: {
    width: number;
    height: number;
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

export interface ArtistData {
  attributes: {
    editorialNotes: {
      short: string;
      standard: string;
    };
    genreNames: [string];
    name: string;
    url: string;
  };
  href: string;
  id: string;
  type: string;
}
