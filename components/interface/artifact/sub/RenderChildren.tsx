import React from "react";
import Reply from "@/components/interface/artifact/sub/Reply";
import { ReplyType } from "@/types/dbTypes";
import { useRepliesQuery } from "@/lib/apiHelper/artifact";
import { useUser } from "@supabase/auth-helpers-react";

type RenderChildrenProps = {
  parentReplyId: string;
  level: number;
  isChild: boolean;
};

function RenderChildren({
  level,
  parentReplyId,
  isChild,
}: RenderChildrenProps) {
  const user = useUser();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepliesQuery(user!.id, undefined, parentReplyId);

  const replies = data ? data.pages.flatMap((page) => page.data) : [];

  // The layout prop preserves the LayoutGroup functionality of animating the container to expand/contract when replies are loaded or unloaded.
  return (
    <div className="flex flex-col w-full pb-8">
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
            <div className={`text-xs text-gray3 font-bold pt-8`}>more</div>
          )}
        </button>
      )}
    </div>
  );
}

export default RenderChildren;
