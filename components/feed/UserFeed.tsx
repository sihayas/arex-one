import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/lib/api/feedAPI";
import { Entry } from "@/components/feed/subcomponents/Entry";
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
        <div key={activity.id} className={index > 0 ? "pt-4" : ""}>
          {activity.review ? (
            <Entry review={activity.review} />
          ) : (
            // You may provide a placeholder or different handling if there's no review
            <div>No review available for this activity.</div>
          )}
        </div>
      ))}
    </>
  );
};

export default UserFeed;
