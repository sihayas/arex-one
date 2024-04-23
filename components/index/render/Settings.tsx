import { motion } from "framer-motion";
import React from "react";
import { useInterfaceContext } from "@/context/Interface";
import { Settings } from "@/types/dbTypes";

const containerVariants = {
  enter: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
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
type SettingKey = keyof Settings;

const Settings = () => {
  const { user } = useInterfaceContext();
  const [isExportHovered, setIsExportHovered] = React.useState(false);
  const [isArchiveHovered, setIsArchiveHovered] = React.useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings | null>(null);

  if (!user) return null;

  const handleToggleSetting = async (settingType: SettingKey) => {
    // const newValue = !settings[settingType as keyof typeof settings];
    // try {
    //   const settings = await updateNotificationSetting(
    //     user?.id,
    //     settingType,
    //     newValue,
    //   );
    //   setSettings(settings.updatedSettings);
    // } catch (error) {
    //   console.error("Failed to update setting:", error);
    // }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="exit"
      animate="enter"
      exit="exit"
      className={`flex-col flex gap-4 pb-4 items-end`}
    >
      {/* Notifications */}
      <motion.p
        variants={notificationVariants}
        transition={notificationSpring}
        className={`font-medium text-gray3 uppercase text-sm`}
      >
        Notifications
      </motion.p>
      <motion.button
        variants={notificationVariants}
        transition={notificationSpring}
        whileHover={{
          scale: 1.05,
          opacity: 1,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        }}
        whileTap={{ scale: 0.95 }}
        className={`bg-[#F4F4F4] outline outline-1 ${
          settings?.followNotifications
            ? "outline-[#00FF38]/20"
            : "outline-[#CCC]/20"
        } w-[104px] h-9 flex items-center justify-center rounded-xl`}
        style={{
          color: settings?.followNotifications ? "#00FF38" : "#CCC",
        }}
        onClick={() => handleToggleSetting("followNotifications")}
      >
        <p className={`text-base`}>Links</p>
      </motion.button>
      <motion.button
        variants={notificationVariants}
        transition={notificationSpring}
        whileHover={{
          scale: 1.05,
          opacity: 1,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        }}
        whileTap={{ scale: 0.95 }}
        className={`bg-[#F4F4F4] outline outline-1 ${
          settings?.replyNotifications
            ? "outline-[#00FF38]/20"
            : "outline-[#CCC]/20"
        } w-[104px] h-9 flex items-center justify-center rounded-xl`}
        style={{
          color: settings?.replyNotifications ? "#00FF38" : "#CCC",
        }}
        onClick={() => handleToggleSetting("replyNotifications")}
      >
        <p className={`text-base`}>Chains</p>
      </motion.button>
      <motion.button
        variants={notificationVariants}
        transition={notificationSpring}
        whileHover={{
          scale: 1.05,
          opacity: 1,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        }}
        whileTap={{ scale: 0.95 }}
        className={`bg-[#F4F4F4] outline outline-1 ${
          settings?.heartNotifications
            ? "outline-[#00FF38]/20"
            : "outline-[#CCC]/20"
        } w-[104px] h-9 flex items-center justify-center rounded-xl`}
        style={{
          color: settings?.heartNotifications ? "#00FF38" : "#CCC",
        }}
        onClick={() => handleToggleSetting("heartNotifications")}
      >
        <p className={`text-base`}>Hearts</p>
      </motion.button>

      {/* Account */}
      <motion.p
        variants={notificationVariants}
        transition={notificationSpring}
        className={`font-medium text-gray3 uppercase text-sm`}
      >
        Manage Account
      </motion.p>
      <motion.button
        variants={notificationVariants}
        transition={notificationSpring}
        whileHover={{
          scale: 1.05,
          opacity: 1,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={() => setIsExportHovered(true)}
        onMouseLeave={() => setIsExportHovered(false)}
        whileTap={{ scale: 0.95 }}
        className={`bg-[#F4F4F4] outline outline-1 outline-gray2/5 w-[104px] h-9 flex items-center justify-center rounded-xl opacity-50 `}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: isExportHovered ? 1 : 0,
            scale: isExportHovered ? 1 : 0.75,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`absolute center-y right-[112px] text-sm text-gray2 w-max origin-right text-end`}
        >
          <p>Export your data.</p>
          <p>Download a copy of your data.</p>
        </motion.div>
        <p className={`text-base text-gray2`}>Export</p>
      </motion.button>
      <motion.button
        variants={notificationVariants}
        transition={notificationSpring}
        whileHover={{
          scale: 1.05,
          opacity: 1,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={() => setIsArchiveHovered(true)}
        onMouseLeave={() => setIsArchiveHovered(false)}
        whileTap={{ scale: 0.95 }}
        className={`bg-[#F4F4F4] outline outline-1 outline-[#FF8A00]/5 w-[104px] h-9 flex items-center justify-center rounded-xl opacity-50 text-end `}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: isArchiveHovered ? 1 : 0,
            scale: isArchiveHovered ? 1 : 0.75,
            filter: isArchiveHovered ? "blur(0px)" : "blur(4px)",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`absolute center-y right-[112px] text-sm text-gray2 w-max origin-right`}
        >
          <p>Archive your account.</p>
          <p>This action is reversible.</p>
        </motion.div>
        <p className={`text-base text-[#FF8A00]`}>Archive</p>
      </motion.button>
      <motion.button
        variants={notificationVariants}
        transition={notificationSpring}
        whileHover={{
          scale: 1.05,
          opacity: 1,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={() => setIsDeleteHovered(true)}
        onMouseLeave={() => setIsDeleteHovered(false)}
        whileTap={{ scale: 0.95 }}
        className={`bg-[#F4F4F4] outline outline-1 outline-red/5 w-[104px] h-9 flex items-center justify-center rounded-xl opacity-50 relative`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: isDeleteHovered ? 1 : 0,
            scale: isDeleteHovered ? 1 : 0.75,
            filter: isDeleteHovered ? "blur(0px)" : "blur(4px)",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`absolute center-y right-[112px] text-sm text-gray2 w-max origin-right text-end`}
        >
          <p>Permanently delete your account.</p>
          <p>This action is not reversible.</p>
        </motion.div>
        <p className={`text-base text-red`}>Delete</p>
      </motion.button>
    </motion.div>
  );
};

export default Settings;
