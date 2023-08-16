import { useSession } from "next-auth/react";

import { fetchNotificationsForUser } from "@/lib/api/userAPI";
import { Notification } from "@/lib/global/interfaces";

import { useQuery } from "@tanstack/react-query";

import SignalLiked from "./sub/SignalLiked";
import SignalReplied from "./sub/SignalReplied";
import SignalInterlinked from "./sub/SignalInterlinked";
import SignalLinked from "./sub/SignalLinked";

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

  // console.log("notifications", notifications);
  return (
    <div className="flex flex-col gap-6 items-center w-full h-full bg-white">
      <div className="text-sm font-medium pt-6 pb-2">signals</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        notifications.map((notification: Notification) => {
          switch (notification.activity.type) {
            case "like":
              return (
                <>
                  <SignalLiked
                    like={notification.activity.like!}
                    date={notification.activity.createdAt}
                  />
                </>
              );
            case "reply":
              return (
                <>
                  <SignalReplied
                    reply={notification.activity.reply!}
                    date={notification.activity.createdAt}
                  />
                </>
              );
            case "followed_back":
              return (
                <>
                  <SignalInterlinked
                    follows={notification.activity.follow!}
                    date={notification.activity.createdAt}
                  />
                </>
              );
            case "followed":
              return (
                <>
                  <SignalLinked
                    follows={notification.activity.follow!}
                    date={notification.activity.createdAt}
                  />
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
