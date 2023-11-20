import { useNotificationsQuery } from "@/lib/apiHandlers/userAPI";
import Heart from "./signals/Heart";
import Reply from "./signals/Reply";
import Link from "./signals/Link";
import { Notification, User } from "@/types/dbTypes";
import { useUser } from "@supabase/auth-helpers-react";
import { AlbumData, SongData } from "@/types/appleTypes";

export interface extendedNotification extends Notification {
  soundAppleId: { type: string; id: string };
  fetchedSound: SongData | AlbumData;
  users: User[];
}

// Signals component
const Signals = () => {
  const user = useUser();
  const userId = user?.id;

  // Fetch notifications for the user
  const { data: fetchedNotifications, isLoading } =
    useNotificationsQuery(userId);

  console.log(fetchedNotifications);

  return (
    <div className={`flex flex-col w-full gap-8`}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        fetchedNotifications.map(
          (notification: extendedNotification, index: number) => {
            const notificationType =
              notification.aggregation_Key?.split("|")[0];

            switch (notificationType) {
              case "HEART":
                return <Heart key={index} notification={notification} />;
              case "REPLY":
                return <Reply key={index} notification={notification} />;
              case "FOLLOWED":
                return <Link key={index} notification={notification} />;
              default:
                return <div key={index}>n.a</div>;
            }
          },
        )
      )}
    </div>
  );
};

export default Signals;
