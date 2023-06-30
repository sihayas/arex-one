import { useContext } from "react";
import EntryPreview from "./EntryPreview";
import { CMDKContext } from "../../../../../contexts/CMDK";

//Generates a list of entries for a given album
export const RenderEntries = ({ reviews }) => {
  // CMDK Context
  const context = useContext(CMDKContext);
  if (!context) {
    throw new Error("Album must be used within a CMDKProvider");
  }
  const { setSelectedReviewId, setPages, bounce } = context;

  return (
    <div className="flex flex-col gap-4 overflow-visible">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <>
            <div
              key={review.id}
              onClick={() => {
                setSelectedReviewId(review.id);
                setPages((prevPages) => [...prevPages, "entry"]);
                bounce();
              }}
              className="cursor-pointer"
            >
              <EntryPreview key={review.id} {...review} />
            </div>
          </>
        ))
      ) : (
        <div className="text-xs text-grey">no entries</div>
      )}
    </div>
  );
};

export default RenderEntries;
