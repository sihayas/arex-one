import Reply from "@/components/interface/entry/sub/reply/Reply";
import { useQuery } from "@tanstack/react-query";
import { ReplyData } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";
import { fetchReplies } from "@/lib/api/entryAPI";
import React from "react";

type RenderChildrenProps = {
  parentReplyId: string;
  level: number;
};

// RenderReplies component
function RenderChildren({ level, parentReplyId }: RenderChildrenProps) {
  const { data: session } = useSession();

  const userId = session?.user.id;

  // Fetch reply children
  const { data: childReplies } = useQuery(["replies", parentReplyId], () =>
    fetchReplies({ replyId: parentReplyId, userId }),
  );

  return (
    <div className="flex flex-col w-full mb-8">
      {childReplies && childReplies.length > 0 ? (
        childReplies.map(
          (childReply: ReplyData, index: number, isChild: true) => {
            return (
              <Reply
                index={index}
                key={childReply.id}
                reply={childReply}
                level={level}
                isChild={true}
              />
            );
          },
        )
      ) : (
        <div className="text-xs text-[#CCC]"></div>
        // un-chained
      )}
    </div>
  );
}

export default RenderChildren;
