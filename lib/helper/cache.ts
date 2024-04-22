interface Entry {
  id: string;
  sound: { id: string; apple_id: string; type: string };
  type: string;
  author_id: string;
  text: string | null;
  created_at: Date;
  _count: { actions: number; chains: number };
  rating: number | null;
  loved: boolean | null;
  replay: boolean | null;
}

interface Profile {
  id: string;
  image: string;
  username: string;
  bio: string | null;
  essentials: Essential[];
  _count: {
    followers: number;
    entries: number;
  };
}

interface Essential {
  id: string;
  rank: number | null;
  sound: {
    apple_id: string;
    id: string;
  };
}

export const formatEntry = (entry: Entry) => {
  return {
    id: entry.id,
    sound_id: entry.sound.id,
    sound_apple_id: entry.sound.apple_id,
    sound_type: entry.sound.type,
    type: entry.type,
    author_id: entry.author_id,
    text: entry.text,
    created_at: entry.created_at.toISOString(),
    actions_count: entry._count.actions,
    chains_count: entry._count.chains,
    // Extra fields for artifacts
    rating: entry.rating,
    loved: entry.loved,
    replay: entry.replay,
  };
};

export const formatProfile = (profile: Profile) => {
  return {
    id: profile.id,
    image: profile.image,
    username: profile.username,
    bio: profile.bio,
    essentials: JSON.stringify(profile.essentials),
    followers_count: profile._count.followers,
    artifacts_count: profile._count.entries,
  };
};
