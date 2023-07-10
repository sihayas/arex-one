import EntryPreview from "./EntryPreview";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { useThreadcrumb } from "../../../../../context/Threadcrumbs";

interface RenderEntriesProps {
  reviews: ReviewData[];
}

//Generates a list of entries for a given album
export const RenderEntries = ({ reviews }: RenderEntriesProps) => {
  const { setPages, bounce } = useCMDK();
  const { setThreadcrumbs } = useThreadcrumb();

  return (
    <div className="flex flex-col gap-6 overflow-visible">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => {
          if (!review || typeof review !== "object") {
            return null; // Or return some error or placeholder component
          }
          return (
            <div
              key={review.id}
              onClick={() => {
                // Store in pages array with review id
                setPages((prevPages) => [
                  ...prevPages,
                  {
                    name: "entry",
                    threadcrumbs: [review.id],
                  },
                ]);
                setThreadcrumbs([review.id]);
                bounce();
              }}
            >
              <EntryPreview key={review.id} {...review} />
            </div>
          );
        })
      ) : (
        <div className="text-xs text-grey p-2">no entries</div>
      )}
    </div>
  );
};

export default RenderEntries;
