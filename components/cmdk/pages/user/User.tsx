import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCMDK } from "@/context/CMDKContext";
import Favorites from "./subcomponents/Favorites";
import Image from "next/image";
import { FavoritesIcon, HistoryIcon } from "@/components/icons";
import { EntryPreviewUser } from "./subcomponents/EntryPreviewUser";
import { useState } from "react";
import { ReviewData } from "@/lib/interfaces";
import { motion } from "framer-motion";

const User = () => {
  const { pages } = useCMDK();
  const userId = pages[pages.length - 1].user;

  const [activeTab, setActiveTab] = useState("favorites");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Animate tabs
  const variants = {
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

  // Get user data
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["user", userId],
    async () => {
      const url = `/api/user/getById?id=${userId}`;
      const response = await axios.get(url);
      return response.data;
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
      <div className="flex flex-col items-center gap-2 p-8 pb-4">
        <Image
          className="border-8 shadow-medium rounded-full"
          src={user.image}
          alt={`${user.name}'s avatar`}
          width={307}
          height={307}
        />
        <div className="flex flex-col gap-1 items-center">
          <div className="text-sm font-semibold text-black">
            {user.name || "nameless"}
          </div>
          <div className="text-[13px] text-gray2 mb-2">{user.username}</div>
          <div className="text-[13px] text-gray2">
            &middot; {user.profile.bio} &middot;
          </div>
        </div>
      </div>
      {/* Button Navigation  */}
      <div className="flex gap-4 w-full mb-4 items-center justify-center">
        <button
          className={`transform transition-transform duration-200 hover:scale-125`}
          onClick={() => handleTabClick("favorites")}
        >
          <FavoritesIcon
            width={28}
            height={28}
            color={activeTab === "favorites" ? "#333" : "#ccc"}
          />
        </button>
        <button
          className={`transform transition-transform duration-200 hover:scale-125`}
          onClick={() => handleTabClick("history")}
        >
          <HistoryIcon
            width={28}
            height={28}
            color={activeTab === "history" ? "#333" : "#ccc"}
          />
        </button>
      </div>

      {/* Content  */}
      {activeTab === "favorites" && user.profile.favorites && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          <Favorites favorites={user.profile.favorites} />
        </motion.div>
      )}
      {activeTab === "history" && user.reviews && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          {user.reviews.map((review: ReviewData, i: string) => (
            <EntryPreviewUser key={i} review={review} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default User;
