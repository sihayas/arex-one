import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ReplyIcon } from "../../icons";
import { useSession } from "next-auth/react";
import axios from "axios";
import useThreadcrumbs from "../../../hooks/useThreadcrumbs";

const handleAddReply = async ({ replyParent, replyContent, userId }) => {
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
    const res = await axios.post("/api/review/addReply", body);

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

  const { replyParent } = useThreadcrumbs();

  const [replyContent, setReplyContent] = useState("");
  const handleReplyChange = (e) => {
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
        className={`text-xs text-grey outline-none bg-transparent w-full resize-none`}
        placeholder="+ thread"
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
