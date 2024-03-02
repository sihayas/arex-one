import Heart from "@/components/interface/nav/items/notification/Heart";
import Reply from "@/components/interface/nav/items/notification/Reply";
// import Follow from "@/components/interface/nav/items/notification/Follow";
import { PageName, useInterfaceContext } from "@/context/InterfaceContext";
import { GetDimensions } from "@/components/interface/Interface";

const Notifications = () => {
  const { notifs, activePage } = useInterfaceContext();
  const { base, target } = GetDimensions(activePage.name as PageName);

  // The dimensions of the active page are used to determine the width and height of the notifications container
  const { height } = activePage.isOpen ? target : base;
  const offset = height * 0.5;

  return (
    <div
      className={`absolute flex w-[448px] flex-col overflow-scroll h-[calc(50vh)]`}
      style={{
        bottom: `calc(-50vh + ${offset}px) `,
      }}
    >
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
  );
};

export default Notifications;
