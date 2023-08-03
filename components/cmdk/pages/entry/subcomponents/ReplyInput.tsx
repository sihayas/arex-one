import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ReviewData, ReplyData } from "@/lib/interfaces";
import { useThreadcrumb } from "@/context/Threadcrumbs";

interface ReplyInputProps {
  replyParent: ReviewData | ReplyData | null;
  replyContent: string;
  userId: string | undefined;
}

const handleAddReply = async ({
  replyParent,
  replyContent,
  userId,
}: ReplyInputProps) => {
  if (!replyParent) return;

  // Determine if replyParent is a review or reply
  const isReview = "albumId" in replyParent;

  // Grab review Id from either review or reply
  const reviewId = isReview ? replyParent.id : replyParent.reviewId;

  // If replyParent is a review, replyId is null; otherwise, it's the replyParent id
  const replyId = isReview ? null : replyParent.id;

  // If replyParent is a review, rootReplyId is null ()
  const rootReplyId = isReview ? null : replyParent.rootReplyId;

  // Create the body object based on replyId or reviewId
  const body = {
    replyId,
    reviewId,
    rootReplyId,
    content: replyContent,
    userId,
  };
  try {
    const res = await axios.post("/api/review/postReply", body);

    if (res.status === 200) {
      console.log("submmited reply");
    } else {
      console.error(`Error adding reply: ${res.status}`);
    }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};

export const ReplyInput = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { replyParent } = useThreadcrumb();
  const [replyContent, setReplyContent] = useState("");

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = () => {
    handleAddReply({
      replyParent,
      replyContent,
      userId,
    });
  };

  return (
    <div className="flex items-center w-full">
      <TextareaAutosize
        className={`text-sm text-grey outline-none bg-transparent w-full resize-none`}
        placeholder={
          replyParent
            ? "albumId" in replyParent
              ? `new chain`
              : `+ chain: ${replyParent.content}`
            : "+ reply"
        }
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
