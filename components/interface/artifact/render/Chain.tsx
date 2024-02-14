import { ReplyType } from "@/types/dbTypes";
import { useChainQuery } from "@/lib/helper/artifact";
import React, { useEffect, useState } from "react";
import RootReply from "@/components/interface/artifact/items/RootReply";
import Reply from "../items/Reply";

type RenderRepliesProps = {
  userId: string;
  replyId: string;
};

function Chain({ userId, replyId }: RenderRepliesProps) {
  const [depth, setDepth] = useState(0);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChainQuery(userId, replyId);

  const replies = data ? data.pages.flatMap((page) => page.data) : [];

  useEffect(() => {
    setDepth((prevDepth) => prevDepth + replies.length);
  }, []);

  console.log("replies", replies);

  // Add layout group to the 2nd fragment
  return (
    <>
      {replies.length > 0 ? (
        <>
          {replies.map((reply: ReplyType, index: number) => {
            const isRoot = !reply.replyToId;
            const level = depth - index;
            return isRoot ? (
              // Render RootReply for the root reply
              <RootReply key={reply.id} index={index} reply={reply} />
            ) : (
              // Render Reply for all other replies
              <Reply
                key={reply.id}
                index={index}
                reply={reply}
                level={level}
                isChild={true}
              />
            );
          })}
        </>
      ) : (
        <div className="text-action text-sm font-medium uppercase">
          unchained
        </div>
      )}

      {/* End */}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? (
            "loading"
          ) : (
            <div className={`text-gray3 pt-8 text-xs font-bold`}>more</div>
          )}
        </button>
      )}
    </>
  );
}

export default Chain;
