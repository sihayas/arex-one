import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/lib/api/feedAPI";
import { FeedAlbum } from "@/components/feed/FeedAlbum";
import { ActivityData } from "@/lib/interfaces";

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
          <FeedAlbum review={activity.review} />
        </div>
      ))}
    </>
  );
};

export default UserFeed;
