// Renders a list of replies to a review or reply
import Reply from "./Reply";
import { useQuery } from "@tanstack/react-query";
import { ReplyData } from "@/types/interfaces";
import { useSession } from "next-auth/react";
import { fetchReplies } from "@/lib/api/entryAPI";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";

// RenderReplies component
function RenderReplies() {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();

  const activePage: Page = pages[pages.length - 1];
  const reviewId = activePage.entry?.id;

  const userId = session?.user.id;

  // Fetch review replies
  const { data: replies } = useQuery(["replies", reviewId], () =>
    fetchReplies({ reviewId, userId }),
  );

  return (
    <div className="flex flex-wrap p-8">
      {replies && replies.length > 0 ? (
        replies.map((reply: ReplyData) => {
          return (
            <Reply key={reply.id} reply={reply} level={0} isChild={false} />
          );
        })
      ) : (
        <div className="text-xs text-[#CCC]"></div>
        // un-chained
      )}
    </div>
  );
}

export default RenderReplies;
