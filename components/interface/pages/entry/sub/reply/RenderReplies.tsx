import Replies from "./Replies";
// import ReplyInput from "./ReplyInput";

interface RenderRepliesProps {
  threadcrumbs: string[];
}

// Handles animating shrunken thread and renders replies based on threadcrumbs
export const RenderReplies: React.FC<RenderRepliesProps> = ({
  threadcrumbs,
}) => {
  return (
    <div className="flex flex-col bg-white p-8 h-[35.75rem]">
      <Replies reviewId={threadcrumbs[0]} />
      {/* <div className="fixed bottom-8 z-20 w-full rounded-full border p-1 backdrop-blur-sm bg-blurEntry border-silver">k
        <ReplyInput />
      </div> */}
    </div>
  );
};

export default RenderReplies;
