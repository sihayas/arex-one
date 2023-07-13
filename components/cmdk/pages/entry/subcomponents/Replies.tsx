// Renders a list of replies to a review or reply

import Reply from "./Reply";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ReplyData } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import styles from "@/styles/replies.module.css";

interface RepliesProps {
  reviewId?: string | null;
  replyId?: string;
  userId?: string;
  setLoadingReplies?: (loading: boolean) => void;
}

const fetchReplies = ({ reviewId, replyId, userId }: RepliesProps) => {
  const baseURL = "/api/reply/";

  // Decide URL based on presence of reviewId or replyId
  const url = reviewId
    ? `${baseURL}getReviewReplies?id=${reviewId}&userId=${userId}`
    : `${baseURL}getReplyReplies?replyId=${replyId}&userId=${userId}`;

  return axios.get(url).then((res) => res.data);
};

// Replies component
function Replies({ reviewId, replyId }: RepliesProps) {
  const [selectedReply, setSelectedReply] = useState<ReplyData | null>(null);
  const { data: session } = useSession();
  const userId = session?.user.id;

  const fetchRepliesQuery = useQuery(
    ["replies", { reviewId, replyId, userId }],
    () => fetchReplies({ reviewId, replyId, userId })
  );

  if (fetchRepliesQuery.isLoading) {
    return <div></div>;
  }

  if (fetchRepliesQuery.isError) {
    return <div>ehroar</div>;
  }

  const replies = fetchRepliesQuery.data;

  return (
    <TransitionGroup component={null}>
      {replies && replies.length > 0 ? (
        replies.map(
          (reply: ReplyData) =>
            // Only render the Reply component if it is selected or there is no selected reply
            (selectedReply === null || reply.id === selectedReply.id) && (
              <CSSTransition
                key={reply.id}
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
            )
        )
      ) : (
        <div className="text-xs text-[#CCC] mt-4 -ml-1"></div>
        // unthreaded
      )}
    </TransitionGroup>
  );
}

export default Replies;
