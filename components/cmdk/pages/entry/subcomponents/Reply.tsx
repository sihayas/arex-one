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
      className={`flex gap-2 duration-700 ${shrink ? "cursor-pointer" : ""}`}
    >
      {/* Left Side  */}
      <div
        className="flex flex-col"
        onClick={shrink ? handleGoBack : undefined}
      >
        {/* User Avatar & Username */}
        <div className="flex items-center gap-4">
          <UserAvatar
            imageSrc={
              reply.author?.image || "./public/images/default_image.png"
            }
            altText={`${reply.author?.name || "Unknown Author"}'s avatar`}
          />
          <UserName
            color="black"
            username={reply.author.username || "stranger"}
          />
        </div>

        {/* Reply Content & Thread Line  */}
        <div className="flex gap-4 pb-1">
          {/* Vertical Thread Line */}
          <div className="flex flex-col min-w-[2rem] items-center mt-4 -mb-2">
            {reply.replies && reply.replies.length > 0 && (
              <Line
                color={shrink ? "#000" : "#CCC"}
                width={shrink ? "3px" : "1px"}
                animate={shrink}
              />
            )}
          </div>

          {/* Reply Content  */}
          <div className={`text-sm text-black break-words`}>
            {reply.content}
          </div>
        </div>

        {/*Interactions  */}
        {reply.replies && reply.replies.length > 0 && !hideContent && (
          <div className="flex  translate-x-[.28em] gap-[1.225em]">
            <ThreadIcon width={24} height={24} color={"#CCC"} />
            {/* Threader  */}
            <button
              className="flex items-center gap-1 text-grey text-xs text-start hover:text-black duration-300 relative"
              onClick={handleLoadReplies}
            >
              <div className="flex text-xs text-grey w-64">
                {reply.replies.length} threads
              </div>
            </button>
            <button
              className="text-xs text-grey"
              onClick={() => setReplyParent(reply)}
            >
              [set reply parent id]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
