import { useRepliesQuery } from "../../../../lib/helper/interface/artifact";
import React from "react";
import RootReply from "@/components/interface/entry/items/RootReply";
import { LayoutGroup, motion } from "framer-motion";

type RenderRepliesProps = {
  userId: string;
  entryId: string;
};

function Replies({ userId, entryId }: RenderRepliesProps) {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useRepliesQuery(userId, artifactId);
  //
  // const replies = data ? data.pages.flatMap((page) => page.data) : [];

  // Add layout group to the 2nd fragment
  return (
    <>
      {/*{replies.length > 0 ? (*/}
      {/*  <>*/}
      {/*    {replies.map((reply: ReplyType, index: number) => (*/}
      {/*      <RootReply key={reply.id} index={index} reply={reply} />*/}
      {/*    ))}*/}
      {/*  </>*/}
      {/*) : (*/}
      {/*  <div className="text-xl font-semibold text-gray3 text-center uppercase">*/}
      {/*    unchained*/}
      {/*  </div>*/}
      {/*)}*/}

      {/*/!* End *!/*/}
      {/*{hasNextPage && (*/}
      {/*  <button*/}
      {/*    className={`w-full`}*/}
      {/*    onClick={() => fetchNextPage()}*/}
      {/*    disabled={isFetchingNextPage}*/}
      {/*  >*/}
      {/*    {isFetchingNextPage ? (*/}
      {/*      ""*/}
      {/*    ) : (*/}
      {/*      <div*/}
      {/*        className={`text-gray2 pt-8 text-sm uppercase text-center w-full`}*/}
      {/*      >*/}
      {/*        load more*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </button>*/}
      {/*)}*/}
    </>
  );
}

export default Replies;
