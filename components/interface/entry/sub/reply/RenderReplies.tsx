// Renders a list of replies to a review or reply
import ReplyItem from "./Reply";
import { useQuery } from "@tanstack/react-query";
import { Reply } from "@/types/dbTypes";
import { fetchReplies } from "@/lib/apiHandlers/entryAPI";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useUser } from "@supabase/auth-helpers-react";

// RenderReplies component
function RenderReplies() {
  const { pages } = useInterfaceContext();
  const user = useUser();

  const activePage: Page = pages[pages.length - 1];
  const recordId = activePage.record?.id;

  // Fetch review replies
  const { data: replies } = useQuery(["replies", recordId], () =>
    fetchReplies({ recordId, userId: user!.id })
  );

  return (
    <div className="flex flex-wrap p-8 pb-96">
      {replies && replies.length > 0 ? (
        replies.map((reply: Reply) => {
          return (
            <ReplyItem key={reply.id} reply={reply} level={0} isChild={false} />
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
