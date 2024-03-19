import React from "react";
import Reply from "@/components/interface/artifact/items/Reply";
import { ReplyType } from "@/types/dbTypes";
import { useRepliesQuery } from "@/lib/helper/artifact";
import { useInterfaceContext } from "@/context/InterfaceContext";

type RenderChildrenProps = {
  parentReplyId: string;
  level: number;
  isChild: boolean;
};

function Children({ level, parentReplyId, isChild }: RenderChildrenProps) {
  const { user } = useInterfaceContext();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRepliesQuery(
    user!.id,
    undefined,
    parentReplyId,
  );

  const replies = data ? data.pages.flatMap((page) => page.data) : [];

  // The layout prop preserves the LayoutGroup functionality of animating the container to expand/contract when replies are loaded or unloaded.
  return (
    <>
      {replies && replies.length > 0 ? (
        replies.map((childReply: ReplyType, index: number) => {
          return (
            <Reply
              key={childReply.id}
              index={index}
              reply={childReply}
              level={level}
              isChild={isChild}
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
            "loading"
          ) : (
            <div className={`text-gray3 pt-8 text-xs font-bold`}>more</div>
          )}
        </button>
      )}
    </>
  );
}

export default Children;
