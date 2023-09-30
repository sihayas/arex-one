import ReplyChild from "./ReplyChild";
import { useQuery } from "@tanstack/react-query";
import { ReplyData } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";
import { fetchReplies } from "@/lib/api/entryAPI";
import React from "react";

type RenderReplyChildrenProps = {
  parentReplyId: string;
  saturatedColor: string;
  level: number;
};

// RenderReplies component
function RenderReplyChildren({
  level,
  parentReplyId,
  saturatedColor,
}: RenderReplyChildrenProps) {
  const { data: session } = useSession();

  const userId = session?.user.id;

  // Fetch reply children
  const { data: childReplies } = useQuery(["replies", parentReplyId], () =>
    fetchReplies({ replyId: parentReplyId, userId }),
  );

  return (
    <div className="flex flex-col w-full pb-8">
      {childReplies && childReplies.length > 0 ? (
        childReplies.map((childReply: ReplyData, index: number) => {
          return (
            <ReplyChild
              index={index}
              key={childReply.id}
              reply={childReply}
              level={level + 1}
              parentColor={saturatedColor}
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

export default RenderReplyChildren;
