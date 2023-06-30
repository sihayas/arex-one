import Reply from "./Reply";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ReplyData } from "@/lib/interfaces";

interface RepliesProps {
  reviewId?: string | null;
  replyId?: string;
  setLoadingReplies?: (loading: boolean) => void;
}

const fetchReplies = ({ reviewId, replyId }: RepliesProps) => {
  const baseURL = "/api/review/replies/";

  // Decide URL based on presence of reviewId or replyId
  const url = reviewId
    ? `${baseURL}byId?id=${reviewId}`
    : `${baseURL}getReplies?replyId=${replyId}`;

  return axios.get(url).then((res) => res.data);
};

// Replies component
function Replies({ reviewId, replyId }: RepliesProps) {
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);

  const fetchRepliesQuery = useQuery(["replies", { reviewId, replyId }], () =>
    fetchReplies({ reviewId, replyId })
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
        replies.map((reply: ReplyData) => (
          <CSSTransition key={reply.id} timeout={300} classNames="fade">
            <div
              style={{
                display:
                  reply.id === selectedReplyId || selectedReplyId === null
                    ? ""
                    : "none",
              }}
            >
              <Reply reply={reply} setSelectedReplyId={setSelectedReplyId} />
            </div>
          </CSSTransition>
        ))
      ) : (
        <div className="text-xs text-[#CCC] mt-4 -ml-1"></div>
        //  unthreaded
      )}
    </TransitionGroup>
  );
}

export default Replies;
