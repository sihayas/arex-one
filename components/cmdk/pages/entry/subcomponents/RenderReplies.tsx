import Replies from "./Replies";

interface RenderRepliesProps {
  replyIds: string[];
  reviewId: string | null;
}

// Handles animating shrunken thread and renders replies based on threadcrumbs
export const RenderReplies: React.FC<RenderRepliesProps> = ({
  replyIds,
  reviewId,
}) => {
  return (
    <>
      {replyIds.map((replyId, id) => (
        <div key={id} className="flex flex-col gap-2">
          <Replies
            {...(id === 0 ? { reviewId: reviewId } : { replyId: replyId })}
          />
        </div>
      ))}
    </>
  );
};

export default RenderReplies;
