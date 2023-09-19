import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";

import UserSoundtrack from "@/components/interface/user/sub/UserSoundtrack";
import UserProfile from "@/components/interface/user/sub/UserProfile";
import { getUserById } from "@/lib/api/userAPI";
import { ArrowIcon } from "@/components/icons";

const User = () => {
  const { pages } = useInterfaceContext();
  const { data: session } = useSession();
  const sessionUserId = session?.user.id;

  const userId = pages[pages.length - 1].key;

  const [activeTab, setActiveTab] = useState<"profile" | "soundtrack">(
    "profile",
  );
  // Set initial image transform
  const [imageProps, setImageProps] = useState({
    x: "-50%",
    y: "2rem",
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
    setImageProps({ x: "-20rem", y: "0rem", scale: 0.875 });
  };

  const handleImageClick = () => {
    setActiveTab("profile");
    setImageProps({ x: "-50%", y: "2rem", scale: 1 });
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col justify-between">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <>
          {/* Content Outer */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: activeTab === "soundtrack" ? "-50%" : "0%" }}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
            className="w-[200%] h-full flex"
          >
            <UserProfile
              handleSoundtrackClick={handleSoundtrackClick}
              userData={user}
            />
            {activeTab === "soundtrack" ? (
              <UserSoundtrack userId={userId} />
            ) : null}
          </motion.div>

          {/*Footer / Avatar */}
          <div className="w-full flex justify-between p-4 border-t border-dashed border-silver">
            <div className="flex items-center gap-2">
              <Image
                className="rounded-full border border-black"
                onClick={handleImageClick}
                src={user.image}
                alt={`${user.name}'s avatar`}
                width={42}
                height={42}
              />
              <div className="text-sm text-black font-medium">@{user.name}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default User;

// {/* Avatar */}
// <motion.div
//     className="absolute left-1/2 top-0 z-20 rounded-full overflow-hidden border border-silver flex flex-col"
//     initial={{
//       x: imageProps.x,
//       y: imageProps.y,
//       scale: imageProps.scale,
//     }}
//     animate={{
//       x: imageProps.x,
//       y: imageProps.y,
//       scale: imageProps.scale,
//     }}
//     transition={{
//       type: "spring",
//       stiffness: 400,
//       damping: 40,
//     }}
// >
//   <motion.div>
//     <Image
//         onClick={handleImageClick}
//         src={user.image}
//         alt={`${user.name}'s avatar`}
//         width={64}
//         height={64}
//     />
//   </motion.div>
// </motion.div>
