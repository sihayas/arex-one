import Heart from "@/components/interface/nav/items/notification/Heart";
import Reply from "@/components/interface/nav/items/notification/Reply";
// import Follow from "@/components/interface/nav/items/notification/Follow";
import { PageName, useInterfaceContext } from "@/context/Interface";
import { GetDimensions } from "@/components/interface";
import { motion } from "framer-motion";

const containerVariants = {
  enter: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.001, staggerDirection: -1 } },
};

export const notificationVariants = {
  enter: { opacity: 1, scale: 1, translateY: 0 },
  exit: { opacity: 0, scale: 0.75, translateY: 48 },
  transition: { type: "spring", damping: 25, stiffness: 300 },
};

export const notificationSpring = {
  type: "spring",
  damping: 25,
  stiffness: 325,
};

const Notifications = () => {
  const { notifs, activePage } = useInterfaceContext();
  const { base, target } = GetDimensions(activePage.name as PageName);

  const { height } = activePage.isOpen ? target : base;
  const offset = height / 2;

  return (
    <motion.div
      variants={containerVariants}
      initial="exit"
      animate="enter"
      exit="exit"
      style={{
        height: `100vh`,
        bottom: `calc(-50vh + ${offset}px)`, // Levels to bottom of screen
        paddingTop: `calc((100vh - (100vh - ${height}px)/2) - 248px)`,
      }}
      className={`absolute left-0 z-10 flex w-[416px] origin-bottom-left flex-col overflow-y-scroll gap-4 -mx-8 px-8`}
    >
      {Object.entries(notifs).map(([key, notificationGroup], index) => {
        const notificationType = key.split("|")[0].toUpperCase();
        switch (notificationType) {
          case "HEART":
            return (
              <Heart
                index={index}
                key={key}
                notificationsGroup={notificationGroup}
              />
            );
          case "REPLY":
            return (
              <Reply
                index={index}
                key={key}
                notificationsGroup={notificationGroup}
              />
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
