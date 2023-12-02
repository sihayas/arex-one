import React from "react";
import Reply from "@/components/interface/artifact/sub/Reply";
import { useQuery } from "@tanstack/react-query";
import { ReplyType } from "@/types/dbTypes";
import { useRepliesQuery } from "@/lib/apiHelper/artifact";
import { useUser } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";

type RenderChildrenProps = {
  parentReplyId: string;
  level: number;
};

// RenderReplies component
function RenderChildren({ level, parentReplyId }: RenderChildrenProps) {
  const user = useUser();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepliesQuery(user!.id, undefined, parentReplyId);

  const replies = data ? data.pages.flatMap((page) => page.data) : [];

  // The layout prop preserves the LayoutGroup functionality of animating the container to expand/contract when replies are loaded or unloaded.
  return (
    <motion.div layout="position" className="flex flex-col w-full mb-8">
      {replies && replies.length > 0 ? (
        replies.map((childReply: ReplyType, index: number) => {
          return (
            <Reply
              index={index}
              key={childReply.id}
              reply={childReply}
              level={level}
              isChild={true}
            />
          );
        })
      ) : (
        <div className="text-xs text-[#CCC]">seems quiet</div>
      )}

      {/* End */}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? (
            <JellyComponent
              className={"fixed"}
              key="jelly"
              isVisible={isFetchingNextPage}
            />
          ) : (
            <div className={`text-sm text-gray2`}>more</div>
          )}
        </button>
      )}
    </motion.div>
  );
}

export default RenderChildren;
