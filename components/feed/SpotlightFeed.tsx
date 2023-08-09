import { useFetchSpotlightEntries } from "@/lib/api/feedAPI";
import { FeedAlbum } from "@/components/feed/FeedAlbum";
import { ReviewData } from "@/lib/interfaces";

const SpotlightFeed = ({ page }: { page: number }) => {
  const { spotlightEntriesDataQuery, spotlightEntriesQuery } =
    useFetchSpotlightEntries(page);

  if (spotlightEntriesQuery.isLoading) return "Loading spotlight entries...";

  if (spotlightEntriesQuery.error)
    return "An error occurred while fetching spotlight entries";

  if (spotlightEntriesDataQuery.isLoading)
    return "Loading spotlight entry details...";

  if (spotlightEntriesDataQuery.error)
    return "An error occurred while fetching spotlight entry details";

  return (
    <>
      {spotlightEntriesDataQuery.data.map(
        (review: ReviewData, index: number) => (
          <div key={review.id} className={index > 0 ? "pt-4" : ""}>
            <FeedAlbum review={review} />
          </div>
        )
      )}
    </>
  );
};
export default SpotlightFeed;
