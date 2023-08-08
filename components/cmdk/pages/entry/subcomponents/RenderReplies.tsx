import Replies from "./Replies";

interface RenderRepliesProps {
  threadcrumbs: string[];
}

// Handles animating shrunken thread and renders replies based on threadcrumbs
export const RenderReplies: React.FC<RenderRepliesProps> = ({
  threadcrumbs,
}) => {
  return (
    <div className="flex flex-col p-8 pt-0 pb-32 mb-12">
      <Replies reviewId={threadcrumbs[0]} />
    </div>
  );
};

export default RenderReplies;
