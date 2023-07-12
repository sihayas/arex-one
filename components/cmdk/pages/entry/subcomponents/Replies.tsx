// Renders a list of replies to a review or reply

import Reply from "./Reply";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ReplyData } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import { ReplyIcon } from "@/components/icons";

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
        replies.map((reply: ReplyData) => (
          <CSSTransition key={reply.id} timeout={300} classNames="fade">
            <div
              style={{
                display:
                  reply.id === selectedReply?.id || selectedReply === null
                    ? ""
                    : "none",
              }}
            >
              <Reply reply={reply} setSelectedReply={setSelectedReply} />
              {/* Indicate thread parent if selected reply before rendering next set */}
              {reply.id === selectedReply?.id && (
                <div className="flex flex-col translate-y-6">
                  <div className="flex items-center gap-1">
                    <ReplyIcon width={8} height={8} color={"#999"} />
                    <div className="text-xs text-gray2">replying to</div>
                  </div>
                  <div className="ml-3 text-xs text-gray1 font-medium">
                    {selectedReply.author.name}s{" "}
                    <span className=" font-normal">reply</span>
                  </div>
                </div>
              )}
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
