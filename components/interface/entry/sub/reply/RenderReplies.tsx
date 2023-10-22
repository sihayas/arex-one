import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import ReplyItem from "./ReplyItem";
import { Reply } from "@/types/dbTypes";

type RenderRepliesProps = {
  replies: Reply[];
};

function RenderReplies({ replies }: RenderRepliesProps) {
  return (
    <div className="flex flex-wrap p-8 pt-0 pb-96">
      {replies && replies.length > 0 ? (
        <LayoutGroup>
          {replies.map((reply: Reply, index: number) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              level={0}
              isChild={false}
              index={index}
            />
          ))}
        </LayoutGroup>
      ) : (
        <div className="text-xs text-[#CCC]"></div>
      )}
    </div>
  );
}

export default RenderReplies;
