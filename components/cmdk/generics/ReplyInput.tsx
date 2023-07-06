import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ReplyIcon } from "../../icons";
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

  const reviewId = "albumId" in replyParent ? replyParent.id : null;
  const replyId = "albumId" in replyParent ? null : replyParent.id;

  // Create the body object based on replyId or reviewId
  const body = {
    replyId,
    reviewId,
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
  // console.log(replyParent);

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
      <div
        className={`transition-opacity duration-300 ease-in-out ${
          !replyContent
            ? "opacity-100 cursor-pointer"
            : "opacity-0 cursor-default"
        }`}
      ></div>
      <TextareaAutosize
        className={`text-sm text-grey outline-none bg-transparent w-full resize-none`}
        placeholder={
          replyParent
            ? "albumId" in replyParent
              ? `+ thread to ${replyParent.author.username}'s entry`
              : `+ reply to ${replyParent.author.username}'s thread`
            : "+ thread"
        }
        value={replyContent}
        onChange={handleReplyChange}
      />
      <button
        type="submit"
        onClick={handleReplySubmit}
        disabled={!replyContent}
        className={`transition-opacity duration-300 ease-in-out ${
          replyContent
            ? "opacity-100 cursor-pointer"
            : "opacity-0 cursor-default"
        }`}
      >
        <div className=" -rotate-90">
          <ReplyIcon width={16} height={16} color={"#333"} />
        </div>
      </button>
    </div>
  );
};
