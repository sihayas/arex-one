import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";

import UserAvatar from "@/components/global/UserAvatar";

import Soundtrack from "@/components/interface/pages/user/sub/Soundtrack";
import Profile from "@/components/interface/pages/user/sub/Profile";
import { getUserById } from "@/lib/api/userAPI";

const User = () => {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();
  const sessionUserId = session?.user.id;

  const userId = pages[pages.length - 1].key;

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile",
  );
  const [imageProps, setImageProps] = useState({
    x: "-50%",
    y: "-50%",
    scale: 1,
  });

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(["user", userId], () => {
    return getUserById(userId, sessionUserId!);
  });

  const handleSoundtrackClick = () => {
    setActiveTab("soundtrack");
    setImageProps({ x: "-20rem", y: "-12rem", scale: 0.64 }); // Change these values as you like
  };

  const handleImageClick = () => {
    setActiveTab("profile");
    setImageProps({ x: "-50%", y: "-50%", scale: 1 }); // Change these values as you like
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          <motion.div
            className="absolute left-1/2 top-1/2 z-20 rounded-full overflow-hidden border border-silver"
            initial={{
              x: imageProps.x,
              y: imageProps.y,
              scale: imageProps.scale,
            }}
            animate={{
              x: imageProps.x,
              y: imageProps.y,
              scale: imageProps.scale,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
            }}
          >
            <Image
              onClick={handleImageClick}
              src={user.image}
              alt={`${user.name}'s avatar`}
              width={88}
              height={88}
            />
          </motion.div>
          {activeTab === "profile" ? (
            <div className="flex gap-2 h-full w-full relative">
              <Profile
                handleSoundtrackClick={handleSoundtrackClick}
                userData={user}
              />
            </div>
          ) : (
            activeTab === "soundtrack" && <Soundtrack userId={userId} />
          )}
        </>
      )}
    </>
  );
};

export default User;
