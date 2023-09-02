import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/lib/api/feedAPI";
import { Entry } from "@/components/interface/pages/feed/subcomponents/Entry";
import { ActivityData } from "@/lib/global/interfaces";

const UserFeed = ({ userId }: { userId: string | undefined }) => {
  const { data, isLoading, error } = useQuery(
    ["feed", userId],
    () => {
      if (!userId) {
        throw new Error("User ID is undefined");
      }
      return fetchFeed(userId);
    },
    {
      enabled: !!userId,
    }
  );

  if (isLoading) return "Loading...";

  if (error) return `An error has occurred`;

  return (
    <>
      {data.map((activity: ActivityData, index: number) => (
        <>
          {activity.review ? (
            <Entry key={activity.id} review={activity.review} />
          ) : (
            <div>no review available for this activity.</div>
          )}
        </>
      ))}
    </>
  );
};

export default UserFeed;
