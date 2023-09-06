import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/lib/api/feedAPI";
import { Entry } from "@/components/index/feed/subcomponents/Entry";
import { ActivityData } from "@/lib/global/interfaces";

const FeedUser = ({ userId }: { userId: string | undefined }) => {
  const { data, isLoading, error } = useQuery(
    ["feed", userId],
    () =>
      userId
        ? fetchFeed(userId)
        : Promise.reject(new Error("User ID is undefined")),
    { enabled: !!userId }
  );

  return (
    <>
      {isLoading && "loading..."}
      {error && "an error has occurred"}
      {data &&
        data.map((activity: ActivityData, index: number) => (
          <div key={activity.id}>
            {activity.review ? (
              <Entry review={activity.review} />
            ) : (
              "No review available for this activity."
            )}
          </div>
        ))}
    </>
  );
};

export default FeedUser;
