// Renders a list of replies to a review or reply
import Reply from "./Reply";
import { Fragment, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ReplyData } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";
import styles from "@/styles/replies.module.css";
import Line from "../icons/Line";

interface RepliesProps {
  reviewId?: string | null;
  userId?: string;
  setLoadingReplies?: (loading: boolean) => void;
}

const fetchReplies = ({ reviewId, userId }: RepliesProps) => {
  const url = `/api/reply/get/reviewReplies?id=${reviewId}&userId=${userId}`;
  return axios.get(url).then((res) => res.data);
};

// Replies component
function Replies({ reviewId }: RepliesProps) {
  const [selectedReply, setSelectedReply] = useState<ReplyData | null>(null);
  const { data: session } = useSession();
  const userId = session?.user.id;

  const fetchRepliesQuery = useQuery(["replies", { reviewId, userId }], () =>
    fetchReplies({ reviewId, userId })
  );

  if (fetchRepliesQuery.isLoading) {
    return <div></div>;
  }

  if (fetchRepliesQuery.isError) {
    return <div>ehroar</div>;
  }

  const replies = fetchRepliesQuery.data;
  console.log(replies);

  return (
    <TransitionGroup component={null}>
      {replies && replies.length > 0 ? (
        replies.map((reply: ReplyData, index: number) => {
          // Determine if the current reply and the previous reply are root replies
          const isRoot = !reply.replyToId;
          const prevIsRoot = index > 0 ? !replies[index - 1].replyToId : false;
          return (
            // Only render the Reply component if it is selected or there is no selected reply
            (selectedReply === null || reply.id === selectedReply.id) && (
              <Fragment key={reply.id}>
                {/* Render line or empty div based on conditions */}
                {isRoot && prevIsRoot ? (
                  <div className="flex w-8 flex-col items-center">
                    <Line height="12px" />
                  </div>
                ) : (
                  <div style={{ height: "12px" }}>&nbsp;</div>
                )}

                <CSSTransition
                  timeout={500}
                  classNames={{
                    enter: styles["drop-enter"],
                    enterActive: styles["drop-enter-active"],
                    exit: styles["drop-exit"],
                    exitActive: styles["drop-exit-active"],
                    appear: styles["drop-appear"],
                    appearActive: styles["drop-appear-active"],
                  }}
                  appear={true}
                >
                  <Reply reply={reply} setSelectedReply={setSelectedReply} />
                </CSSTransition>
              </Fragment>
            )
          );
        })
      ) : (
        <div className="text-xs text-[#CCC]"></div>
        // unthreadedd
      )}
    </TransitionGroup>
  );
}

export default Replies;
