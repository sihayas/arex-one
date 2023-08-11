import { useFetchBloomingEntries } from "@/lib/api/feedAPI";
import { Entry } from "@/components/cmdk/generics/Entry";
import { ReviewData } from "@/lib/global/interfaces";

const BloomingFeed = ({ page }: { page: number }) => {
  const { bloomingEntriesQuery, bloomingEntriesDataQuery } =
    useFetchBloomingEntries(page);

  if (bloomingEntriesQuery.isLoading) return "Loading blooming entries...";

  if (bloomingEntriesQuery.error)
    return "An error occurred while fetching blooming entries";

  if (bloomingEntriesDataQuery.isLoading)
    return "Loading blooming entry details...";

  if (bloomingEntriesDataQuery.error)
    return "An error occurred while fetching blooming entry details";

  return (
    <>
      {bloomingEntriesDataQuery.data.map(
        (review: ReviewData, index: number) => (
          <div key={review.id} className={index > 0 ? "pt-4" : ""}>
            <Entry review={review} />
          </div>
        )
      )}
    </>
  );
};
export default BloomingFeed;
