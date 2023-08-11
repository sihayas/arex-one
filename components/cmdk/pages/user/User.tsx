import { useQuery } from "@tanstack/react-query";
import { useCMDK } from "@/context/CMDKContext";
import Favorites from "./subcomponents/Favorites";
import Image from "next/image";
import { useState } from "react";
import { ReviewData } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";
import {
  follow,
  unfollow,
  getUserById,
  isUserFollowing,
} from "@/lib/api/userAPI";
import { Entry } from "@/components/cmdk/generics/Entry";
import { UserAvatar } from "../../generics";
import { useDragLogic } from "@/hooks/npm/useDragLogic";
import { animated } from "@react-spring/web";

const User = () => {
  const { pages } = useCMDK();
  const { data: session } = useSession();
  const signedInUserId = session?.user.id;

  const userId = pages[pages.length - 1].user;

  const [followingAtoB, setFollowingAtoB] = useState<boolean | null>(null);
  const [followingBtoA, setFollowingBtoA] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

  const navigateLeft = () => {
    setCurrentSection("Favorites");
  };
  const navigateRight = () => {
    setCurrentSection("Reviews");
  };

  // Use the drag logic hook
  const { bind, x, scaleSpring } = useDragLogic({
    navigateLeft,
    navigateRight,
  });

  // State to hold the current section (Favorites or Reviews)
  const [currentSection, setCurrentSection] = useState("Favorites");

  const { data: followStatus, refetch: refetchFollowStatus } = useQuery(
    ["followStatus", signedInUserId, userId],
    () =>
      signedInUserId && userId ? isUserFollowing(signedInUserId, userId) : null,
    {
      enabled: !!userId && !!signedInUserId,
      onSuccess: (data) => {
        if (data !== null) {
          setFollowingAtoB(data.isFollowingAtoB);
          setFollowingBtoA(data.isFollowingBtoA);
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
      if (followingAtoB) {
        await unfollow(signedInUserId, userId);
        setFollowingAtoB(false);
      } else {
        await follow(signedInUserId, userId);
        setFollowingAtoB(true);
      }
      refetchFollowStatus();
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
      if (!userId || !session?.user.id) {
        throw new Error("userId must be defined");
      }
      return getUserById(userId, session.user.id);
    },
    {
      enabled: !!userId,
    }
  );

  let linkText = "link?";
  let linkColor = "#999";
  if (followingAtoB && followingBtoA) {
    linkText = "interlinked";
    linkColor = "#b1f36b";
  } else if (followingAtoB) {
    linkText = "linked";
    linkColor = "#000";
  } else if (followingBtoA) {
    linkText = "interlink?";
    linkColor = "#FFE601";
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="absolute right-6 top-6 font-bold text-[#000]">rx</div>

      <animated.div
        className="flex w-full h-full overflow-hidden"
        style={{ width: "200%" }}
      >
        <animated.div
          className="flex w-full h-full"
          {...bind()}
          style={{
            transform: x.to((val) => `translateX(${val}px)`),
          }}
        >
          <div className="flex w-full h-full">
            {/* Add wrapper for Favorites */}
            <Favorites favorites={user.favorites} />
          </div>
          <div className="flex w-full h-full">
            {/* Add wrapper for Reviews */}
            <div className="flex flex-col mt-[64px] pb-32">
              <div className="text-sm -mb-2">soundtrack</div>
              {user.reviews.map((review: ReviewData, i: string) => (
                <Entry key={i} review={review} />
              ))}
            </div>
          </div>
        </animated.div>
      </animated.div>

      {/* Footer  */}
      <div className="flex fixed items-center justify-between p-6 bottom-0 z-50 bg-white border-t border-silver border-dashed w-full">
        <div className="flex gap-2 items-center">
          <Image
            className="border-[1.5px] border-silver rounded-full"
            src={user.image}
            alt={`${user.name}'s avatar`}
            width={48}
            height={48}
          />
          <div className="text-xs font-medium text-[#000]">{user.name}*</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Following Status/Button */}
          {signedInUserId && userId && (
            <div className="flex gap-1 items-center justify-center hoverable-small">
              <div
                className="w-[6px] h-[6px] rounded-full"
                style={{ backgroundColor: linkColor }} // Set color based on following status
              />
              <button
                className={`text-xs font-medium hover:underline transition-all duration-300${
                  loadingFollow ? " pulse" : ""
                }`}
                style={{ color: linkColor }} // Set color based on following status
                onClick={handleFollow}
              >
                {linkText}
              </button>
            </div>
          )}

          {/* Followers Preview */}
          {user.followers.length > 0 ? (
            <div className="flex">
              {user.followers.length > 3 && (
                <div className="text-xs text-gray2">
                  +{user.followers.length - 3}
                </div>
              )}
              {user.followers.slice(0, 3).map(({ follower }, index) => {
                return (
                  <UserAvatar
                    key={index}
                    className={`!border-2 border-white shadow-md ${
                      index !== 0 ? "-ml-1" : ""
                    }`}
                    imageSrc={follower.image} // Access properties on the nested follower object
                    altText={`${follower.name}'s avatar`}
                    width={20}
                    height={20}
                  />
                );
              })}
            </div>
          ) : (
            <div>No followers</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
//  <animated.div className="bg-white w-full h-full relative flex flex-col items-center overflow-scroll scrollbar-none pb-48 pt-48 border border-silver shadow-cmdkScaled">
//       {/* Header  */}
//       <div className="flex flex-col items-center gap-4 p-8 pb-4">
//         <Image
//           className="border-2 shadow-medium rounded-full"
//           src={user.image}
//           alt={`${user.name}'s avatar`}
//           width={307}
//           height={307}
//         />
//         <div className="flex flex-col gap-1 items-center">
//           <div className="text-sm font-semibold text-black">
//             {user.name || "nameless"}
//           </div>
//           <div className="text-[13px] text-gray2 mb-2">{user.name}</div>
//           <div className="text-[13px] text-gray2">
//             &middot; {user.bio} &middot;
//           </div>
//         </div>
//       </div>
//       {/* Button Navigation  */}
//       <div className="flex gap-4 w-full mb-4 items-center justify-center pb-2">
//         <button
//           className={`hover:invert transition-all duration-300 hoverable-small`}
//           onClick={() => handleTabClick("favorites")}
//         >
//           <FavoritesIcon
//             width={32}
//             height={32}
//             color={activeTab === "favorites" ? "#000" : "#ccc"}
//           />
//         </button>
//         <button
//           className={`hover:invert transition-all duration-300 hoverable-small`}
//           onClick={() => handleTabClick("history")}
//         >
//           <HistoryIcon
//             width={32}
//             height={32}
//             color={activeTab === "history" ? "#000" : "#ccc"}
//           />
//         </button>
//         {signedInUserId &&
//           (following === null || loadingFollow ? (
//             <button disabled>Loading...</button>
//           ) : (
//             <button onClick={handleFollow}>
//               {following ? "Unfollow" : "Follow"}
//             </button>
//           ))}
//       </div>

//       {/* Content  */}
//       {/* {activeTab === "favorites" && user.favorites && (
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           variants={TAB_ANIMATION_VARIANTS}
//         >
//           <Favorites favorites={user.favorites} />
//         </motion.div>
//       )} */}
//       {/* {activeTab === "history" && user.reviews && (
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           variants={TAB_ANIMATION_VARIANTS}
//         >
//           {user.reviews.map((review: ReviewData, i: string) => (
//             <UserEntry key={i} review={review} />
//           ))}
//         </motion.div>
//       )} */}
//     </animated.div>
