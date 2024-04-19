import { Entry, ReplyType } from "@/types/dbTypes";
import { useNavContext } from "@/context/Nav";
import { useQuery } from "@tanstack/react-query";
import { AlbumData, SongData } from "@/types/appleTypes";
import { toast } from "sonner";

export type ReplyTargetType = {
  entry: Entry;
  reply: ReplyType | null;
} | null;

export const createReply = async (
  replyTarget: ReplyTargetType,
  text: string,
  userId: string,
) => {
  if (!replyTarget) return console.error("No reply target found.");

  const entry = replyTarget.entry;
  const reply = replyTarget.reply;

  // Replying directly to an artifact
  const artifactId = entry.id;
  const artifactAuthorId = entry.author.id;
  const rootId = reply ? reply.rootId : null; //*

  // Replying to a reply
  const toReplyId = reply ? reply.id : null; //**
  const toReplyAuthorId = reply ? reply.author.id : null;
  const toReplyParentId = reply ? reply.replyToId : null;
  const requestBody = {
    artifactId,
    artifactAuthorId,
    rootId,
    toReplyId,
    toReplyAuthorId,
    toReplyParentId,
    text,
    userId,
  };

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

export const createEntry = async (submissionData: {
  text: string;
  rating: number;
  replay: boolean;
  loved: boolean;
  userId: string;
  sound: AlbumData | SongData;
}) => {
  const endpoint = "/api/entry/post/";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
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
