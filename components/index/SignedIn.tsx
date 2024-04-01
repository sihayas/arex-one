import { AnimatePresence, motion } from "framer-motion";
import Avatar from "@/components/global/Avatar";
import Dash from "@/components/index/items/Dash";
import React from "react";
import Feed from "@/components/index/render/Feed";
import { UserType } from "@/types/dbTypes";
import { SettingsIcon } from "@/components/icons";
import Settings from "@/components/index/render/Settings";

type Feed = "personal" | "bloom" | "recent";

type SignedInProps = {
  user: UserType;
};

const SignedIn: React.FC<SignedInProps> = ({ user }) => {
  const [activeFeed] = React.useState<Feed>("personal");
  const [showSettings, setShowSettings] = React.useState<boolean>(false);
  return (
    <motion.div className={`h-screen w-screen`}>
      {/*  Blur Backdrop */}
      <motion.div
        className={`center-x pointer-events-none absolute top-0 z-0 h-full w-full bg-white/50 backdrop-blur-[72px]`}
      />
      {activeFeed === "bloom" ? (
        <Feed userId={user.id} type={"bloom"} />
      ) : activeFeed === "personal" ? (
        <Feed userId={user.id} type={"personal"} />
      ) : activeFeed === "recent" ? (
        <Feed userId={user.id} type={"recent"} />
      ) : null}

      <div
        className={`absolute left-1/2 top-8 z-20 -translate-x-[204px] flex items-center flex-row-reverse`}
      >
        <Avatar
          className="shadow-shadowKitMedium rounded-full"
          imageSrc={user.image}
          altText={`avatar`}
          width={48}
          height={48}
          user={user}
        />
        <p
          className={`absolute right-14 text-base text-black font-medium mix-blend-darken`}
        >
          @{user.username}
        </p>
      </div>

      <div className={`absolute bottom-4 right-4 flex items-end gap-4`}>
        <div className={`flex flex-col items-end`}>
          <AnimatePresence>{showSettings && <Settings />}</AnimatePresence>

          <motion.button
            whileHover={{
              scale: 1.05,
              opacity: 1,
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
            }}
            onClick={async () => {
              const response = await fetch("/api/oauth/apple/logout", {
                method: "POST",
              });
              if (response.ok) {
                window.location.href = "/";
              }
            }}
            whileTap={{ scale: 0.95 }}
            className={`bg-[#F4F4F4] outline outline-1 outline-red/5 w-[104px] h-9 flex items-center justify-center rounded-xl opacity-50`}
          >
            <p className={`text-base text-red`}>Disconnect</p>
          </motion.button>
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
            opacity: 1,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className={`bg-[#F4F4F4] outline outline-1 outline-silver w-8 h-8 flex items-center justify-center rounded-full opacity-25`}
        >
          <SettingsIcon />
        </motion.button>
      </div>

      <Dash className="absolute left-1/2 top-8 -translate-x-[182px]" />
    </motion.div>
  );
};

export default SignedIn;
