import { useQuery } from "@tanstack/react-query";
import SignalLiked from "./subcomponents/SignalLiked";
import SignalReplied from "./subcomponents/SignalReplied";
import SignalInterlinked from "./subcomponents/SignalInterlinked";
import SignalLinked from "./subcomponents/SignalLinked";
import { fetchNotificationsForUser } from "@/lib/api/userAPI";
import { useSession } from "next-auth/react";
import { Notification } from "@/lib/global/interfaces";

const Signals = () => {
  const { data: session } = useSession();
  const userId = session!.user.id;

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(
    ["notifications", userId],
    () => fetchNotificationsForUser(userId),
    {
      enabled: !!userId,
    }
  );

  console.log("notifications", notifications);
  return (
    <div className="flex flex-col gap-4 items-center w-full h-full bg-white">
      <div className="text-sm font-medium pt-6 pb-2">signals</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        notifications.map((notification: Notification) => {
          switch (notification.activity.type) {
            case "like":
              return (
                <>
                  <SignalLiked like={notification.activity.like!} />
                </>
              );
            case "reply":
              return (
                <>
                  <SignalReplied reply={notification.activity.reply!} />
                </>
              );
            case "followed_back":
              return (
                <>
                  <SignalInterlinked follows={notification.activity.follow!} />
                </>
              );
            case "followed":
              return (
                <>
                  <SignalLinked follows={notification.activity.follow!} />
                </>
              );
            default:
              return <div>Unknown Notification Type</div>;
          }
        })
      )}
    </div>
  );
};

export default Signals;
