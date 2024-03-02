import Heart from "@/components/interface/nav/items/notification/Heart";
import Reply from "@/components/interface/nav/items/notification/Reply";
// import Follow from "@/components/interface/nav/items/notification/Follow";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Notifications = () => {
  const { notifs } = useInterfaceContext();

  return (
    <div
      className={`scrollbar-none -z-10 flex h-full w-full flex-col overflow-scroll`}
    >
      <div className={`flex w-full flex-col`}>
        {Object.entries(notifs).map(([key, notificationGroup], index) => {
          const notificationType = key.split("|")[0].toUpperCase();
          switch (notificationType) {
            case "HEART":
              return (
                <>
                  <Heart key={key} notificationsGroup={notificationGroup} />
                  {/*<div className="bg-silver h-[1.5px] w-full rounded-full" />*/}
                </>
              );
            case "REPLY":
              return (
                <>
                  <Reply key={key} notificationsGroup={notificationGroup} />
                  {/*<div className="bg-silver h-[1.5px] w-full rounded-full" />*/}
                </>
              );
            // case "FOLLOWED":
            //   return <Follow key={key} notification={notificationGroup} />;
            default:
              return <div key={key}>n.a</div>;
          }
        })}
      </div>
    </div>
  );
};

export default Notifications;
