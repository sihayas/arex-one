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

const User = () => {
  const { pages } = useCMDK();
  const { data: session } = useSession();
  const signedInUserId = session?.user.id;

  const userId = pages[pages.length - 1].user;

  const [following, setFollowing] = useState<boolean | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);

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
      if (!userId || !session?.user.id) {
        throw new Error("userId must be defined");
      }
      return getUserById(userId, session.user.id);
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
    <div className="flex flex-col w-full h-full relative">
      <div className="absolute right-6 top-6 font-bold text-[#000]">rx</div>
      {/* Favorites  */}
      <Favorites favorites={user.favorites} />

      {/* Reviews  */}
      {/* <div className="p-8 flex flex-col">
        {user.reviews.map((review: ReviewData, i: string) => (
          <Entry key={i} review={review} />
        ))}
        <div className="fixed right-8 bottom-4 text-xs text-gray2">
          soundtrack
        </div>
      </div> */}

      {/* Footer  */}
      <div className="flex fixed items-center justify-between p-6 bottom-0 z-50 bg-white border-t border-silver border-dashed w-full">
        <div className="flex gap-2 items-center">
          <Image
            className="border-[1.5px] border-[#000] rounded-full"
            src={user.image}
            alt={`${user.name}'s avatar`}
            width={48}
            height={48}
          />
          <div className="text-xs font-medium text-black">{user.name}*</div>
        </div>

        <div className="flex flex-col">
          {/* Following Status/Button */}
          {signedInUserId && userId && (
            <div className="flex gap-1 items-center justify-center">
              <div
                className={`w-[6px] h-[6px] rounded-full ${
                  following ? "bg-black" : "bg-gray2"
                }`}
              />
              <button
                className={`${
                  following ? "text-black" : "text-gray2"
                } text-xs font-medium hover:underline hover:text-black transition-all duration-300`}
                onClick={handleFollow}
              >
                {following ? "linked" : "link"}
              </button>
              {loadingFollow && (
                <div className="ml-2">
                  <div className="w-4 h-4 border-2 border-black rounded-full animate-spin"></div>
                </div>
              )}
            </div>
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
