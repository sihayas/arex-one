import EntryPreview from "./EntryPreview";
import { ReviewData } from "@/lib/interfaces";
import useCMDKContext from "../../../../../hooks/useCMDK";
import { useThreadcrumb } from "../../../../../context/Threadcrumbs";

interface RenderEntriesProps {
  reviews: ReviewData[];
}

//Generates a list of entries for a given album
export const RenderEntries = ({ reviews }: RenderEntriesProps) => {
  const { setPages, bounce } = useCMDKContext();
  const { setThreadcrumbs } = useThreadcrumb();

  return (
    <div className="flex flex-col gap-4 overflow-visible">
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
              className="cursor-pointer"
            >
              <EntryPreview key={review.id} {...review} />
            </div>
          );
        })
      ) : (
        <div className="text-xs text-grey">no entries</div>
      )}
    </div>
  );
};

export default RenderEntries;
