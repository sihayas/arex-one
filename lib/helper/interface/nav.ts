import { useNavContext } from "@/context/Nav";
import { useQuery } from "@tanstack/react-query";
import { PageSound } from "@/context/Interface";
import { fetchSourceAlbum, getSoundDatabaseId } from "@/lib/global/musickit";

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
  const { inputValue, activeAction, selectedFormSound } = useNavContext();
  const { data, isInitialLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/search/get/?query=${searchQuery}`).then((res) => res.json()),
    {
      enabled: !selectedFormSound && !!inputValue && activeAction === "none",
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

export const createEntry = async (formData: {
  text: string;
  rating: number;
  replay: boolean;
  loved: boolean;
  userId: string;
  sound: PageSound;
}) => {
  // determine a source album
  let source = await fetchSourceAlbum(formData.sound.apple_id);

  if (source) {
    formData.sound.apple_id = source.id;
    formData.sound.name = source.attributes.name;
    formData.sound.artist_name = source.attributes.artistName;
    formData.sound.release_date = source.attributes.releaseDate;
    formData.sound.type = source.type;
    formData.sound.identifier = source.attributes.upc;
  }

  try {
    const response = await fetch("/api/entry/post/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
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
