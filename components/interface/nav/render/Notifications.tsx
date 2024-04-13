import { PageName, useInterfaceContext } from "@/context/Interface";
import { GetDimensions } from "@/components/interface/Interface";
import { motion } from "framer-motion";
import Notification from "@/components/interface/nav/items/Notification";

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

  const aggregatedNotifications = {};

  notifs.forEach((notificationJson) => {
    const notification = JSON.parse(notificationJson);

    // 'heart|soundId|targetId|userId'
    const keyParts = notification.key.split("|");
    const type = keyParts[0];
    const targetId = keyParts[2]; // This is the 'targetId'

    // Create a unique key for aggregation
    const aggregateKey = `${type}|${targetId}`;

    // Initialize the array if it doesn't exist
    if (!aggregatedNotifications[aggregateKey]) {
      aggregatedNotifications[aggregateKey] = [];
    }

    // Add the notification to the correct array
    aggregatedNotifications[aggregateKey].push(notification);
  });

  console.log(aggregatedNotifications);

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
      className={`absolute left-0 z-10 flex w-[416px] origin-bottom-left flex-col overflow-y-scroll gap-4 -mx-8 px-8 scrollbar-none`}
    >
      {Object.entries(aggregatedNotifications).map(
        ([key, notificationGroup], index) => {
          // Split the key to extract the type and targetId if needed
          const parts = key.split("|");
          const notificationType = parts[0].toUpperCase();

          return (
            <Notification
              key={key}
              index={index}
              notificationType={notificationType}
              notificationsGroup={notificationGroup}
            />
          );
        },
      )}
    </motion.div>
  );
};

export default Notifications;
