import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Record, Reply } from "@/types/dbTypes";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import UserAvatar from "@/components/global/UserAvatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion, useMotionValue } from "framer-motion";

const MotionTextareaAutosize = motion(TextareaAutosize);

const ReplyInput = () => {
  // Get user and replyParent from context
  const { user } = useInterfaceContext();
  const { replyParent } = useThreadcrumb();
  // State for reply content
  const [replyContent, setReplyContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Handle change in reply input
  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  // Define the type for the parameters of handleAddReply
  interface HandleAddReplyParams {
    replyParent: Record | Reply;
    replyContent: string;
    userId: string;
    type: string;
  }

  // Handle adding reply
  const handleAddReply = useCallback(
    async ({
      replyParent,
      replyContent,
      userId,
      type,
    }: HandleAddReplyParams) => {
      if (!replyParent) return;

      const isReply = !isRecord(replyParent) && type === "reply";
      const isRecordType = isRecord(replyParent) && type === "record";

      const requestBody = {
        replyId: isReply ? replyParent.id : null,
        recordId: isRecordType
          ? replyParent.id
          : isReply
          ? replyParent.recordId
          : null,
        rootReplyId: isReply ? replyParent.rootReplyId : null,
        content: replyContent,
        userId,
      };

      // Try to post reply
      try {
        const res = await axios.post(
          "/api/record/entry/post/reply",
          requestBody
        );
        // If successful, log success
        if (res.status === 200) {
          console.log("submitted reply");
        } else {
          // Else, log error
          console.error(`Error adding reply: ${res.status}`);
        }
      } catch (error) {
        // Log error if any
        console.error("Error adding reply:", error);
      }
    },
    []
  );

  // Handle reply submission
  const handleReplySubmit = () => {
    if (!replyParent || !replyContent || !user?.id) return;

    // Determine type of replyParent
    const type = isRecord(replyParent) ? "record" : "reply";
    // Add reply
    handleAddReply({ replyParent, replyContent, userId: user?.id, type });
  };

  // Render ReplyInput component
  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0 }}
      className={`w-full p-8 fixed bottom-0 right-0 flex ${
        isFocused ? "justify-center" : "justify-end"
      }`}
    >
      <motion.div
        layout
        animate={{
          width:
            isFocused || replyContent
              ? "416px"
              : replyParent && !isRecord(replyParent)
              ? "180px"
              : "112px",
        }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 140,
          mass: 0.35,
        }}
        className="rounded-[28px] z-50 flex items-center justify-end gap-2 pr-[2px] pl-3
        shadow-shadowKitMedium outline outline-silver outline-[.5px] bg-[#F4F4F2]"
      >
        <button
          type="submit"
          onClick={handleReplySubmit}
          disabled={!replyContent}
          className={` ${replyContent ? "" : "hidden"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path d="M5 0L10 10L0 10L5 0Z" fill="#CCC" />
          </svg>
        </button>

        <MotionTextareaAutosize
          layout="position"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`text-sm text-gray2 outline-none bg-transparent resize-none py-2 w-full`}
          value={replyContent}
          onChange={handleReplyChange}
          placeholder="+ trace"
        />

        <motion.div layout="position" className="flex items-center gap-2 p-1">
          <UserAvatar
            className={`border border-silver min-w-[32px] min-h-[32px]`}
            imageSrc={user?.image}
            altText={`${user?.username}'s avatar`}
            width={32}
            height={32}
            user={user!}
          />
          {/* Line */}
          {replyParent && !isRecord(replyParent) && (
            <motion.div
              layout="position"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{
                height: 1.5,
                backgroundColor: "rgba(0,0,0,0.1)",
                width: 32,
                originX: 0,
              }}
            />
          )}
          {/* Context Avatars */}
          {replyParent && !isRecord(replyParent) && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.5, x: 50, y: 0 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <UserAvatar
                className={`outline outline-silver outline-1`}
                imageSrc={replyParent.author.image}
                altText={`${replyParent.author.username}'s avatar`}
                width={24}
                height={24}
                user={replyParent.author}
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ReplyInput;

// Helper function to check if replyParent is a Record
const isRecord = (replyParent: Record | Reply): replyParent is Record => {
  return (replyParent as Record).appleAlbumData !== undefined;
};
