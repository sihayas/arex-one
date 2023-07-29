import { useQuery } from "@tanstack/react-query";
import { useCMDK } from "@/context/CMDKContext";
import Favorites from "./subcomponents/Favorites";
import Image from "next/image";
import { FavoritesIcon, HistoryIcon } from "@/components/icons";
import { EntryPreviewUser } from "./subcomponents/EntryPreviewUser";
import { useState } from "react";
import { ReviewData } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  follow,
  unfollow,
  getUserById,
  isUserFollowing,
} from "@/lib/api/userAPI";

const TAB_ANIMATION_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

const User = () => {
  const { pages } = useCMDK();
  const { data: session } = useSession();
  const signedInUserId = session?.user.id;

  const userId = pages[pages.length - 1].user;

  const [activeTab, setActiveTab] = useState("favorites");
  const [following, setFollowing] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const { data: isFollowing, refetch: refetchIsFollowing } = useQuery(
    ["isFollowing", signedInUserId, userId],
    () =>
      signedInUserId && userId ? isUserFollowing(signedInUserId, userId) : null,
    {
      enabled: !!userId && !!signedInUserId,
      onSuccess: (data) => {
        if (data !== null) {
          setFollowing(data.isFollowing);
        }
      },
    }
  );

  // Function to handle follow/unfollow
  const handleFollow = async () => {
    if (!signedInUserId || !userId) {
      console.log("User is not signed in or user to follow/unfollow not found");
      return;
    }

    setLoadingFollow(true);
    try {
      if (following) {
        await unfollow(signedInUserId, userId);
        setFollowing(false);
      } else {
        await follow(signedInUserId, userId);
        setFollowing(true);
      }
      refetchIsFollowing();
    } catch (error) {
      console.error("Error following/unfollowing", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  // Query to get user Data
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["user", userId],
    () => {
      if (!userId) {
        throw new Error("userId must be defined");
      }
      return getUserById(userId);
    },
    {
      enabled: !!userId,
    }
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }
  console.log("user", user);

  return (
    <div className="bg-white w-full h-full rounded-full relative flex flex-col items-center overflow-scroll scrollbar-none pb-48 pt-48 border border-silver">
      {/* Header  */}
      <div className="flex flex-col items-center gap-4 p-8 pb-4">
        <Image
          className="border-2 shadow-medium rounded-full"
          src={user.image}
          alt={`${user.name}'s avatar`}
          width={307}
          height={307}
        />
        <div className="flex flex-col gap-1 items-center">
          <div className="text-sm font-semibold text-black">
            {user.name || "nameless"}
          </div>
          <div className="text-[13px] text-gray2 mb-2">{user.name}</div>
          <div className="text-[13px] text-gray2">
            &middot; {user.bio} &middot;
          </div>
        </div>
      </div>
      {/* Button Navigation  */}
      <div className="flex gap-4 w-full mb-4 items-center justify-center pb-2">
        <button
          className={`hover:invert transition-all duration-300 hoverable-small`}
          onClick={() => handleTabClick("favorites")}
        >
          <FavoritesIcon
            width={32}
            height={32}
            color={activeTab === "favorites" ? "#000" : "#ccc"}
          />
        </button>
        <button
          className={`hover:invert transition-all duration-300 hoverable-small`}
          onClick={() => handleTabClick("history")}
        >
          <HistoryIcon
            width={32}
            height={32}
            color={activeTab === "history" ? "#000" : "#ccc"}
          />
        </button>
        {signedInUserId &&
          (following === null || loadingFollow ? (
            <button disabled>Loading...</button>
          ) : (
            <button onClick={handleFollow}>
              {following ? "Unfollow" : "Follow"}
            </button>
          ))}
      </div>

      {/* Content  */}
      {/* {activeTab === "favorites" && user.favorites && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={TAB_ANIMATION_VARIANTS}
        >
          <Favorites favorites={user.favorites} />
        </motion.div>
      )} */}
      {/* {activeTab === "history" && user.reviews && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={TAB_ANIMATION_VARIANTS}
        >
          {user.reviews.map((review: ReviewData, i: string) => (
            <EntryPreviewUser key={i} review={review} />
          ))}
        </motion.div>
      )} */}
    </div>
  );
};

export default User;
