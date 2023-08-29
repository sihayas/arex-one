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
      {/* <div className="w-full fixed bottom-8 bg-blurEntry backdrop-blur-sm p-1 rounded-full z-20 border border-silver">
        <ReplyInput />
      </div> */}
    </div>
  );
};

export default RenderReplies;
