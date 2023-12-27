import Heart from "@/components/interface/nav/sub/notification/Heart";
import Reply from "@/components/interface/nav/sub/notification/Reply";
import Follow from "@/components/interface/nav/sub/notification/Follow";
import { Notification, UserType } from "@/types/dbTypes";
import { useUser } from "@supabase/auth-helpers-react";
import { AlbumData, SongData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Notifications = () => {
  const { notifs } = useInterfaceContext();

  console.log(notifs);
  return (
    <div className={`flex flex-col w-full gap-8 p-4`}>
      {Object.entries(notifs).map(([key, notificationGroup], index) => {
        const notificationType = key.split("|")[0].toUpperCase();
        switch (notificationType) {
          case "HEART":
            return (
              <>
                <Heart key={key} notificationsGroup={notificationGroup} />
                <div className="w-full h-[1.5px] bg-silver rounded-full" />
              </>
            );
          case "REPLY":
            return (
              <>
                <Reply key={key} notificationsGroup={notificationGroup} />
                <div className="w-full h-[1.5px] bg-silver rounded-full" />
              </>
            );
          // case "FOLLOWED":
          //   return <Follow key={key} notification={notificationGroup} />;
          default:
            return <div key={key}>n.a</div>;
        }
      })}
    </div>
  );
};

export default Notifications;
