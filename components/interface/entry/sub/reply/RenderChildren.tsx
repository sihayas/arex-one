import ReplyItem from "@/components/interface/entry/sub/reply/Reply";
import { useQuery } from "@tanstack/react-query";
import { Reply } from "@/types/dbTypes";
import { useSession } from "next-auth/react";
import { fetchReplies } from "@/lib/apiHandlers/entryAPI";
import React from "react";
import { useUser } from "@supabase/auth-helpers-react";

type RenderChildrenProps = {
  parentReplyId: string;
  level: number;
};

// RenderReplies component
function RenderChildren({ level, parentReplyId }: RenderChildrenProps) {
  const user = useUser();

  // Fetch reply children
  const { data: childReplies } = useQuery(["replies", parentReplyId], () =>
    fetchReplies({ replyId: parentReplyId, userId: user!.id })
  );

  return (
    <div className="flex flex-col w-full mb-8">
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
    </div>
  );
}

export default RenderChildren;
