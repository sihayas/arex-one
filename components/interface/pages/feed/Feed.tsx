import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { fetchFeed } from "@/lib/api/feedAPI";
import { useDragLogic } from "@/hooks/handleInteractions/useDrag/feed";
import { useQuery } from "@tanstack/react-query";
import { animated } from "@react-spring/web";
import { useScrollPosition } from "@/hooks/handleInteractions/useScrollPosition";

// import NavBar from "@/components/nav/Nav";
import SpotlightFeed from "@/components/interface/pages/feed/sections/SpotlightFeed";
import BloomingFeed from "@/components/interface/pages/feed/sections/BloomingFeed";
import UserFeed from "@/components/interface/pages/feed/sections/UserFeed";

export default function Feed() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { scrollContainerRef } = useScrollPosition();

  const [currentFeed, setCurrentFeed] = useState("default");

  const { bind, x, scaleSpring } = useDragLogic({
    navigateLeft: () =>
      setCurrentFeed(currentFeed === "spotlight" ? "in bloom" : "default"),
    navigateRight: () =>
      setCurrentFeed(currentFeed === "default" ? "in bloom" : "spotlight"),
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

  console.log("rendering feed");
  return (
    <div className="w-full h-[100vh] overflow-hidden relative">
      {/* Render the feed here using the data */}
      <animated.div
        className="bg-white w-full h-full overflow-scroll scrollbar-none border-silver rounded-[24px] flex flex-col gap-8"
        ref={scrollContainerRef}
      >
        {feedContent}
      </animated.div>
      {/* <NavBar /> */}
    </div>
  );
}
