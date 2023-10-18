import React, { useState } from "react";
import { useSession } from "next-auth/react";

import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";

import { ReviewData, ReplyData } from "@/types/interfaces";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import UserAvatar from "@/components/global/UserAvatar";

interface ReplyInputProps {
  replyParent: ReviewData | ReplyData | null;
  replyContent: string;
  userId: string | undefined;
  type: "review" | "reply";
}

// Determine if replying to a review or a reply
const isReview = (data: ReviewData | ReplyData): data is ReviewData => {
  return (data as ReviewData).albumId !== undefined;
};

const handleAddReply = async ({
  replyParent,
  replyContent,
  userId,
  type,
}: ReplyInputProps) => {
  if (!replyParent) return;

  let reviewId = null;
  let replyId = null;
  let rootReplyId = null;

  // If reply input is responding to a review.
  if (isReview(replyParent) && type === "review") {
    reviewId = replyParent.id;
  } else if (!isReview(replyParent) && type === "reply") {
    // If reply input is responding to a reply.
    reviewId = replyParent.reviewId;
    replyId = replyParent.id;
    rootReplyId = replyParent.rootReplyId;
  }

  const requestBody = {
    replyId,
    reviewId,
    rootReplyId,
    content: replyContent,
    userId,
  };

  try {
    const res = await axios.post("/api/record/entry/post/reply", requestBody);
    if (res.status === 200) {
      console.log("submitted reply");
    } else {
      console.error(`Error adding reply: ${res.status}`);
    }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};

const ReplyInput = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { replyParent } = useThreadcrumb();
  const [replyContent, setReplyContent] = useState("");

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = () => {
    let type: "review" | "reply" | null = null;
    if (replyParent) {
      if (isReview(replyParent)) {
        type = "review";
      } else if (replyParent) {
        type = "reply";
      }
    }

    if (type && replyContent && userId && replyParent) {
      handleAddReply({
        replyParent,
        replyContent,
        userId,
        type,
      });
    }
  };

  return (
    <div className="flex items-center gap-2 border border-silver rounded-full z-50 bg-white">
      <UserAvatar
        className=""
        imageSrc={session?.user.image}
        altText={`${session?.user.name}'s avatar`}
        width={32}
        height={32}
        userId={session!.user.id}
      />
      <TextareaAutosize
        className={`text-sm text-black outline-none bg-transparent w-full resize-none`}
        value={replyContent}
        onChange={handleReplyChange}
      />
      <button
        type="submit"
        onClick={handleReplySubmit}
        disabled={!replyContent}
        className={`transition-opacity duration-300 ease-in-out ${
          replyContent ? "opacity-100 " : "opacity-0 cursor-default"
        }`}
      >
        <div className="text-xs">submit</div>
      </button>
    </div>
  );
};

export default ReplyInput;
