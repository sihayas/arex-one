import { ReplyType } from "@/types/dbTypes";
import { useRepliesQuery } from "@/lib/apiHelper/artifact";
import React from "react";
import RootReply from "@/components/interface/artifact/items/RootReply";
import { LayoutGroup } from "framer-motion";

type RenderRepliesProps = {
  userId: string;
  artifactId: string;
};

function Replies({ userId, artifactId }: RenderRepliesProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepliesQuery(userId, artifactId);

  const replies = data ? data.pages.flatMap((page) => page.data) : [];

  // Add layout group to the 2nd fragment
  return (
    <>
      {replies.length > 0 ? (
        <>
          {replies.map((reply: ReplyType, index: number) => (
            <RootReply key={reply.id} index={index} reply={reply} />
          ))}
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

export default Replies;
