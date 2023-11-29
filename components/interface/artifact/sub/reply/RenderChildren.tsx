import ReplyItem from "@/components/interface/artifact/sub/reply/ReplyItem";
import { useQuery } from "@tanstack/react-query";
import { Reply } from "@/types/dbTypes";
import { useRepliesQuery } from "@/lib/apiHandlers/artifactAPI";
import React from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

type RenderChildrenProps = {
  parentReplyId: string;
  level: number;
};

// RenderReplies component
function RenderChildren({ level, parentReplyId }: RenderChildrenProps) {
  const user = useUser();

  const { data: childReplies } = useRepliesQuery(
    user!.id,
    undefined,
    parentReplyId,
  );

  // The layout prop preserves the LayoutGroup functionality of animating the container to expand/contract when replies are loaded or unloaded.
  return (
    <motion.div layout="position" className="flex flex-col w-full mb-8">
      {childReplies && childReplies.length > 0 ? (
        childReplies.map((childReply: Reply, index: number) => {
          return (
            <ReplyItem
              index={index}
              key={childReply.id}
              reply={childReply}
              level={level}
              isChild={true}
            />
          );
        })
      ) : (
        <div className="text-xs text-[#CCC]"></div>
        // un-chained
      )}
    </motion.div>
  );
}

export default RenderChildren;
