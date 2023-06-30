// Importing required modules
import React, { useState } from "react";
import { Line, UserName, UserAvatar } from "../../../generics";
import { ThreadIcon } from "../../../../icons";
import useThreadcrumbs from "../../../../../hooks/useThreadcrumbs";
import { ReplyData } from "@/lib/interfaces";

interface ReplyProps {
  reply: ReplyData;
  setSelectedReplyId: (id: string | null) => void;
}
export default function Reply({ reply, setSelectedReplyId }: ReplyProps) {
  const { addToThreadcrumbs, removeUpToId, setReplyParent } = useThreadcrumbs();
  const [shrink, setShrink] = useState(false); // State for reply shrink
  const [hideContent, setHideContent] = useState(false); // State for hiding reply content

  // Handle loading of replies
  const handleLoadReplies = () => {
    setHideContent(true);
    setSelectedReplyId(reply.id);
    // Once Reply content is hidden & all other Replies are faded out
    setTimeout(() => {
      setShrink(true);
      addToThreadcrumbs(reply.id);
    }, 500);
  };

  // Handle "Go Back" button click
  const handleGoBack = () => {
    removeUpToId(reply.id);
    setShrink(false);
    setHideContent(false);
    setSelectedReplyId(null);
  };

  return (
    <div
      className={`flex gap-2 duration-700 pb-2 ${
        shrink ? "cursor-pointer" : ""
      }`}
    >
      {/* Left Side  */}
      <div
        className="flex flex-col items-center"
        onClick={shrink ? handleGoBack : undefined}
      >
        <UserAvatar
          imageSrc={reply.author?.image || "./public/images/default_image.png"}
          altText={`${reply.author?.name || "Unknown Author"}'s avatar`}
        />

        {/* Vertical Thread Line */}
        {reply.replies && reply.replies.length !== 0 && (
          <Line
            color={shrink ? "#000" : "#CCC"}
            width={shrink ? "3px" : "1px"}
            animate={shrink}
          />
        )}

        {/*Load More Replies  */}
        {reply.replies && reply.replies.length > 0 && !hideContent && (
          <>
            {/* Threader  */}
            <button
              className="flex items-center gap-1 text-grey text-xs text-start hover:text-black duration-300 relative"
              onClick={handleLoadReplies}
            >
              {/* Removing rotate breaks alignment for some reason. */}
              <div className="rotate-[360deg] -mt-1  pl-[1px]">
                <ThreadIcon width={24} height={24} color={"#CCC"} />
              </div>
              <div className="flex text-xs left-6 gap-2 bottom-1 text-greyUnselected absolute w-64">
                {reply.replies.length} threads
                <button onClick={() => setReplyParent(reply)}>
                  [set reply parent id]
                </button>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Right Side/ Author */}

      <div
        className={`flex flex-col mt-1.5 gap-1 w-full ${
          reply.replies && reply.replies.length > 0 ? "pb-7" : "pb-2"
        }`}
      >
        <div className="flex gap-2 items-center">
          <UserName
            color="black"
            username={reply.author.username || "stranger"}
          />
        </div>
        {/* Reply Content  */}
        <div className={`text-sm text-black break-words`}>{reply.content}</div>
      </div>
    </div>
  );
}
