import Heart from "@/components/interface/nav/items/notification/Heart";
import Reply from "@/components/interface/nav/items/notification/Reply";
// import Follow from "@/components/interface/nav/items/notification/Follow";
import { PageName, useInterfaceContext } from "@/context/InterfaceContext";
import { GetDimensions } from "@/components/interface/Interface";
import { motion } from "framer-motion";

const Notifications = () => {
  const { notifs, activePage } = useInterfaceContext();
  const { base, target } = GetDimensions(activePage.name as PageName);

  // The height of the notification container is half the viewport.
  // Therefore, we pull it down by half the viewport height to level it
  // with the bottom of the interface. We then pull it up by half the
  // current interface page height to have it always expand the same amount.
  // Framer Motion's initial Y value is the offset we just used to push
  // the notification back down to have it be leveled initially, and then
  // it animates/expands appropriately.

  const { height } = activePage.isOpen ? target : base;
  const offset = height * 0.5;

  return (
    <motion.div
      initial={{
        y: offset,
        opacity: 0,
        scale: 0,
        filter: "blur(8px)",
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        y: offset,
        opacity: 0,
        scale: 0,
        filter: "blur(8px)",
      }}
      transition={{
        type: "spring",
        damping: 28,
        stiffness: 200,
        mass: 0.8,
      }}
      className={`absolute left-0 flex w-[448px] flex-col overflow-y-scroll h-[calc(50vh)] origin-top-left mask-top pt-20 z-10`}
      style={{
        bottom: `calc(-50vh + ${offset}px)`,
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
    </motion.div>
  );
};

export default Notifications;
