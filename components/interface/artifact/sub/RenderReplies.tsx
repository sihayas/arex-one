import { LayoutGroup } from "framer-motion";
import { ReplyType } from "@/types/dbTypes";
import { useRepliesQuery } from "@/lib/apiHelper/artifact";
import React from "react";
import RootReply from "@/components/interface/artifact/sub/RootReply";

type RenderRepliesProps = {
  userId: string;
  artifactId: string;
};

function RenderReplies({ userId, artifactId }: RenderRepliesProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepliesQuery(userId, artifactId);

  const replies = data ? data.pages.flatMap((page) => page.data) : [];

  // Add layoutgroup to the 2nd fragment
  return (
    <>
      {replies && replies.length > 0 ? (
        <>
          {replies.map((reply: ReplyType, index: number) => (
            <RootReply key={reply.id} reply={reply} index={index} />
          ))}
        </>
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
    </>
  );
}

export default RenderReplies;
