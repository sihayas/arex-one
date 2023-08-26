import Replies from "./Replies";

interface RenderRepliesProps {
  threadcrumbs: string[];
}

// Handles animating shrunken thread and renders replies based on threadcrumbs
export const RenderReplies: React.FC<RenderRepliesProps> = ({
  threadcrumbs,
}) => {
  return (
    <div className="flex flex-col pb-96 ">
      <Replies reviewId={threadcrumbs[0]} />
    </div>
  );
};

export default RenderReplies;
