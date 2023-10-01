import { useQuery } from "@tanstack/react-query";
import { fetchFeedAndMergeAlbums } from "@/lib/api/feedAPI";
import { Entry } from "@/components/index/feed/subcomponents/Entry";
import { ActivityData } from "@/lib/global/interfaces";
import { useInterfaceContext } from "@/context/InterfaceContext";

const FeedUser = ({ userId }: { userId: string | undefined }) => {
  const { pages } = useInterfaceContext();
  const { data, isLoading, error } = useQuery(
    ["feed", userId],
    () =>
      userId
        ? fetchFeedAndMergeAlbums(userId)
        : Promise.reject(new Error("User ID is undefined")),
    { enabled: !!userId },
  );

  console.log(pages);

  return (
    <>
      {isLoading && "loading..."}
      {error && "an error has occurred"}
      {data &&
        data.map((activity: ActivityData, index: number) => (
          <>
            {activity.review ? (
              <Entry review={activity.review} />
            ) : (
              "No review available for this activity."
            )}
          </>
        ))}
    </>
  );
};

export default FeedUser;
