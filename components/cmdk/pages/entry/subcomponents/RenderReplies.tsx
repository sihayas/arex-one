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
    <div className="flex flex-col gap-4 p-8">
      {replyIds.map((replyId, id) => (
        <div key={id} className="flex flex-col gap-4">
          <Replies
            {...(id === 0 ? { reviewId: reviewId } : { replyId: replyId })}
          />
        </div>
      ))}
    </div>
  );
};

export default RenderReplies;
