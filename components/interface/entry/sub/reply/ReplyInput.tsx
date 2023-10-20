import React, { useState } from "react";

import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";

import { Record, Reply } from "@/types/dbTypes";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import UserAvatar from "@/components/global/UserAvatar";
import { useInterfaceContext } from "@/context/InterfaceContext";

const ReplyInput = () => {
  const { user } = useInterfaceContext();
  const userId = user?.id;

  const { replyParent } = useThreadcrumb();
  const [replyContent, setReplyContent] = useState("");

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = () => {
    let type: "record" | "reply" | null = null;
    if (replyParent) {
      if (isRecord(replyParent)) {
        type = "record";
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
        imageSrc={user?.image}
        altText={`${user?.username}'s avatar`}
        width={32}
        height={32}
        user={user!}
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

// Determine if replying to a review or a reply
const isRecord = (replyParent: Record | Reply): replyParent is Record => {
  return (replyParent as Record).appleAlbumData !== undefined;
};

interface handleAddReplyProps {
  replyParent: Record | Reply | null;
  replyContent: string;
  userId: string | undefined;
  type: "record" | "reply";
}

const handleAddReply = async ({
  replyParent,
  replyContent,
  userId,
  type,
}: handleAddReplyProps) => {
  if (!replyParent) return;

  let recordId = null;
  let replyId = null;
  let rootReplyId = null;

  // If reply input is responding to a review.
  if (isRecord(replyParent) && type === "record") {
    recordId = replyParent.id;
  } else if (!isRecord(replyParent) && type === "reply") {
    // If reply input is responding to a reply.
    recordId = replyParent.recordId;
    replyId = replyParent.id;
    rootReplyId = replyParent.rootReplyId;
  }

  const requestBody = {
    replyId,
    recordId,
    rootReplyId,
    content: replyContent,
    userId,
  };

  try {
    const res = await axios.post("/api/record/entry/post/reply", requestBody);
    console.log(res);
    if (res.status === 200) {
      console.log("submitted reply");
    } else {
      console.error(`Error adding reply: ${res.status}`);
    }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};
