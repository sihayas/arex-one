// Renders a list of replies to a review or reply
import Reply from "./Reply";
import { useQuery } from "@tanstack/react-query";
import { ReplyData } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";
import { fetchReplies } from "@/lib/api/entryAPI";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";

// Replies component
function Replies() {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();

  const activePage: Page = pages[pages.length - 1];
  const reviewId = activePage.review?.id;

  const userId = session?.user.id;

  // Render review replies
  const { data: replies } = useQuery(["replies", reviewId], () =>
    fetchReplies({ reviewId, userId }),
  );

  return (
    <>
      {replies && replies.length > 0 ? (
        replies.map((reply: ReplyData) => {
          return <Reply key={reply.id} reply={reply} level={0} />;
        })
      ) : (
        <div className="text-xs text-[#CCC]"></div>
        // un-chained
      )}
    </>
  );
}

export default Replies;
