import { LayoutGroup } from "framer-motion";
import Reply from "./Reply";
import { ReplyType } from "@/types/dbTypes";

type RenderRepliesProps = {
  replies: ReplyType[];
};

function RenderReplies({ replies }: RenderRepliesProps) {
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
    </>
  );
}

export default RenderReplies;
