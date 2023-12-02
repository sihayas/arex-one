import { LayoutGroup } from "framer-motion";
import Reply from "./Reply";
import { ReplyType } from "@/types/dbTypes";
import { useRepliesQuery } from "@/lib/apiHelper/artifact";
import { JellyComponent } from "@/components/global/Loading";
import React from "react";

type RenderRepliesProps = {
  userId: string;
  artifactId: string;
};

function RenderReplies({ userId, artifactId }: RenderRepliesProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepliesQuery(userId, artifactId);

  const replies = data ? data.pages.flatMap((page) => page.data) : [];

  return (
    <>
      {replies && replies.length > 0 ? (
        <LayoutGroup>
          {replies.map((reply: ReplyType, index: number) => (
            <Reply
              key={reply.id}
              reply={reply}
              level={0}
              isChild={false}
              index={index}
            />
          ))}
        </LayoutGroup>
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
    </>
  );
}

export default RenderReplies;
