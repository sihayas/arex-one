import { useNavContext } from "@/context/Nav";
import { useQuery } from "@tanstack/react-query";
import { PageSound } from "@/context/Interface";
import { fetchSourceAlbum } from "@/lib/global/musickit";

export const createReply = async (text: string, userId: string) => {
  try {
    // const res = await axios.post("/api/reply/post/", requestBody);
    // if (res.status !== 200) {
    //   console.error(`Error adding reply: ${res.status}`);
    // }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};

export const Search = (searchQuery: string) => {
  const { inputValue, activeAction, formSound } = useNavContext();
  const { data, isInitialLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/search/get/?query=${searchQuery}`).then((res) => res.json()),
    {
      enabled: !formSound && !!inputValue && activeAction === "none",
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: data ?? [],
    isInitialLoading,
    isFetching,
    error: !!error,
  };
};

export const createEntry = async (
  text: string,
  rating: number,
  replay: boolean,
  loved: boolean,
  userId: string,
  sound: PageSound,
) => {
  let source;
  const isAlbum = sound.type === "albums";
  const isSong = sound.type === "songs";

  // usually not present when coming from a search item
  const sendSoundData = !sound.id;

  // determine the "source" album only if it's an album and no db_id is set
  if (sendSoundData && sound.type === "albums") {
    source = await fetchSourceAlbum(sound.apple_id);
  }

  // create the object
  const entry = {
    userId,
    text,
    rating,
    replay,
    loved,

    sound: {
      id: sound.id, // nullable
      // sound data, only if db_id is not set, to create the sound
      ...(sendSoundData && {
        apple_id: isAlbum ? source.id : sound.apple_id,
        name: isAlbum ? source.attributes.name : sound.name,
        artist_name: isAlbum ? source.attributes.artistName : sound.artist_name,
        release_date: isAlbum
          ? source.attributes.releaseDate
          : sound.release_date,
        identifier: isAlbum ? source.attributes.isrc : sound.identifier,
        type: sound.type,
        ...(isSong && {
          song_album_id: source.relationships.albums.data[0].id,
          song_album_name: source.relationships.albums.data[0].attributes.name,
        }),
      }),
    },
  };

  try {
    const response = await fetch("/api/entry/post/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (response.status === 201) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    throw new Error(`Error during submission:`);
  }
};
