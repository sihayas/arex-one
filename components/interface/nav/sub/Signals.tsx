import { useNotificationsQuery } from "@/lib/apiHandlers/userAPI";
import { Notification } from "@/types/dbTypes";

import SignalInterlinked from "./items/SignalInterlinked";
import { useUser } from "@supabase/auth-helpers-react";
import { ActivityType } from "@/types/dbTypes";

const Signals = () => {
  const user = useUser();
  const userId = user?.id;

  const { data: notifications, isLoading } = useNotificationsQuery(userId);

  console.log("notifications", notifications);
  return (
    <div className="flex flex-col gap-6 items-center w-full h-full bg-white">
      {/* {isLoading ? (
        <div>Loading...</div>
      ) : (
        notifications.map((notification: Notification) => {
          switch (notification.activity.type) {
            case ActivityType.HEART:
              return (
                <SignalHearted
                  heart={notification.activity.heart!}
                  date={notification.activity.createdAt}
                />
              );
            case ActivityType.REPLY:
              return (
                <SignalReplied
                  reply={notification.activity.reply!}
                  date={notification.activity.createdAt}
                />
              );
            case ActivityType.FOLLOWED_BACK:
              return (
                <SignalInterlinked
                  follows={notification.activity.follow!}
                  date={notification.activity.createdAt}
                />
              );
            case ActivityType.FOLLOWED:
              return (
                <SignalLinked
                  follows={notification.activity.follow!}
                  date={notification.activity.createdAt}
                />
              );
            default:
              return <div>Unknown Notification Type</div>;
          }
        })
      )} */}
    </div>
  );
};

export default Signals;
