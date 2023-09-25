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
import { getRootRepliesForReview } from "@/lib/api/entryAPI";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";

// Replies component
function Replies() {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();
  const [selectedReply, setSelectedReply] = useState<ReplyData | null>(null);

  const activePage: Page = pages[pages.length - 1];
  const reviewId = activePage.review?.id;

  const userId = session?.user.id;

  // Fetch root replies for the review using React Query
  const {
    data: replies,
    isLoading: isLoadingReplies,
    isError,
  } = useQuery(
    ["rootReplies", reviewId, userId],
    () => getRootRepliesForReview(reviewId, session?.user.id),
    {
      enabled: !!reviewId && !!session?.user.id, // Only run the query if
    },
  );

  return (
    <TransitionGroup component={null}>
      {replies && replies.length > 0 ? (
        replies.map((reply: ReplyData, index: number) => {
          return (
            // Only render the Reply component if it is selected or there is no selected reply
            (selectedReply === null || reply.id === selectedReply.id) && (
              <Fragment key={reply.id}>
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
