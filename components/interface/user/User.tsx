import React, { useEffect } from "react";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { AnimatePresence, motion } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/sub/Essentials";
import Settings from "@/components/interface/user/sub/Settings";
import { SettingsIcon, TailIcon } from "@/components/icons";
import FollowButton from "./sub/components/Link";
import Soundtrack from "@/components/interface/user/sub/Entries";
import Sideline from "@/components/interface/user/sub/Sideline";
import Entries from "@/components/interface/user/sub/Entries";
import Sounds from "@/components/interface/user/sub/Sounds";

export type Section = "essentials" | "sounds" | "entries" | "wisps";

const User = () => {
  const { user, activePage, setActivePage } = useInterfaceContext();
  const [activeSection, setActiveSection] =
    React.useState<Section>("essentials");

  const pageUser = activePage.user;

  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);

  const { userData } = data || {};

  useEffect(() => {
    const newIsOpenValue = activeSection !== "essentials";

    const updatedActivePage = {
      ...activePage,
      isOpen: newIsOpenValue,
    };

    setActivePage(updatedActivePage);
  }, [activeSection, setActivePage]);

  if (!user || isLoading || isError) return <div>log in</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full flex"
    >
      {/* Card Area */}
      <motion.div
        className={`p-8 flex justify-between overflow-hidden z-0 will-change-transform top-0 left-0 min-h-full w-full`}
      >
        <div
          className={`absolute bg-black/5 w-full h-full top-0 left-0 backdrop-blur-2xl overflow-visible -z-10`}
        />

        <Sideline
          userData={userData}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Footer */}
        <div className={`ml-2 mt-auto gap-4 relative`}>
          <Image
            className={`rounded-max shadow-shadowKitHigh`}
            src={userData.image}
            alt={`${userData.name}'s avatar`}
            width={64}
            height={64}
          />
          <AnimatePresence>
            {activeSection === "essentials" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className={`absolute bg-white px-3 py-1.5 w-max max-w-[180px] left-16 bottom-16 rounded-2xl overflow-visible drop-shadow-xl`}
                >
                  <motion.div className={`text-xs break-words text-gray5`}>
                    {userData.bio}
                  </motion.div>

                  <div className={`w-3 h-3 absolute -left-1 -bottom-1`}>
                    <div
                      className={`bg-white w-2 h-2 absolute top-0 right-0 rounded-full`}
                    />
                    <div
                      className={`bg-white w-1 h-1 absolute bottom-0 left -0 rounded-full`}
                    />
                  </div>
                </div>

                <div
                  className={`absolute center-y left-[74px] w-max font-medium tracking-tight text-base leading-[11px] text-gray2`}
                >
                  {userData.username}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col overflow-visible w-full h-full`}
          >
            {activeSection === "essentials" && (
              <Essentials essentials={userData.essentials} />
            )}
            {activeSection === "entries" && <Entries userId={user.id} />}
            {activeSection === "sounds" && <Sounds userId={user.id} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default User;

// {/*<motion.div className={`absolute left-12 top-0`}>*/}
// {/*  <div*/}
// {/*    className={`bg-white rounded-[15px] py-1.5 px-[9px] text-sm w-max text-center`}*/}
// {/*  >*/}
// {/*    {userData.bio}*/}
// {/*  </div>*/}
// {/*  <TailIcon className={`absolute left-2 -translate-y-[2px]`} />*/}
// {/*</motion.div>*/}
