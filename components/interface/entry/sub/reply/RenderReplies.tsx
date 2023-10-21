import ReplyItem from "./Reply";
import { Reply } from "@/types/dbTypes";

type RenderRepliesProps = {
  replies: Reply[];
};

function RenderReplies({ replies }: RenderRepliesProps) {
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
