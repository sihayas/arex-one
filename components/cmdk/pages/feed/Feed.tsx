import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { fetchFeed } from "@/lib/api/feedAPI";
import { useDragLogic } from "@/hooks/handleInteractions/useDragLogic";
import { useQuery } from "@tanstack/react-query";
import { animated } from "@react-spring/web";

// import NavBar from "@/components/nav/Nav";
import SpotlightFeed from "@/components/cmdk/pages/feed/sections/SpotlightFeed";
import BloomingFeed from "@/components/cmdk/pages/feed/sections/BloomingFeed";
import UserFeed from "@/components/cmdk/pages/feed/sections/UserFeed";

export default function Feed() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentFeed, setCurrentFeed] = useState("default");

  const navigateLeft = () => {
    if (currentFeed === "spotlight") setCurrentFeed("in bloom");
    else if (currentFeed === "in bloom") setCurrentFeed("default");
  };

  const navigateRight = () => {
    if (currentFeed === "default") setCurrentFeed("in bloom");
    else if (currentFeed === "in bloom") setCurrentFeed("spotlight");
  };

  const { bind, x, scaleSpring } = useDragLogic({
    navigateLeft,
    navigateRight,
  });

  const { data, isLoading, error } = useQuery(
    ["feed", userId],
    () => {
      if (!userId) {
        throw new Error("User ID is undefined");
      }
      return fetchFeed(userId);
    },
    {
      enabled: !!userId,
    }
  );

  if (!session) {
    return (
      <div className="w-full h-full justify-self-center self-center rounded-[16px] p-8 overflow-scroll scrollbar-none">
        unauthorized
      </div>
    );
  }

  if (isLoading) return "Loading...";

  if (error) return `An error has occurred`;

  let feedContent;
  switch (currentFeed) {
    case "spotlight":
      feedContent = <SpotlightFeed page={1} />;
      break;
    case "in bloom":
      feedContent = <BloomingFeed page={1} />;
      break;
    default:
      feedContent = <UserFeed userId={userId} />;
      break;
  }

  return (
    <div>
      <div className="w-full h-[100vh] overflow-hidden relative">
        {/* Render the feed here using the data */}
        <animated.div
          style={{
            x,
            ...scaleSpring,
          }}
          {...bind()}
          className="bg-white w-full h-full p-8 overflow-scroll scrollbar-none active:border border-silver rounded-[20px]"
        >
          {feedContent}
          <div className="h-[8.5rem]"></div>
        </animated.div>
        {/* <NavBar /> */}
      </div>
    </div>
  );
}
