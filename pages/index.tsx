import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout";
import Head from "next/head";
import React, { useState } from "react";
import NavBar from "@/components/nav/Nav";
import { fetchFeed } from "@/lib/api/feedAPI";
import SpotlightFeed from "@/components/feed/sections/SpotlightFeed";
import BloomingFeed from "@/components/feed/sections/BloomingFeed";
import UserFeed from "@/components/feed/sections/UserFeed";
import { useDragLogic } from "@/hooks/handleInteractions/useDragLogic";
import { animated } from "@react-spring/web";

export default function Home() {
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
      <Layout>
        <Head>
          <title>rx</title>
        </Head>

        <div className="w-[576px] h-[98vh] bg-white border border-silver justify-self-center self-center rounded-[16px] p-8 overflow-scroll scrollbar-none">
          <NavBar />
        </div>
      </Layout>
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
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      <div className="w-[566px] h-[100vh] justify-self-center self-center rounded-[20px] overflow-hidden relative">
        {/* Render the feed here using the data */}
        <animated.div
          style={{
            x,
            ...scaleSpring,
          }}
          {...bind()}
          className="bg-white w-full h-full p-8 overflow-scroll scrollbar-none active:border border-silver rounded-[20px] pb-96"
        >
          {feedContent}
        </animated.div>
        {/* Footer */}
        <div className="absolute bottom-[30px] right-[80px] text-black text-xs">
          {currentFeed === "default" ? `` : `${currentFeed}`}
        </div>
        <NavBar />
      </div>

      {/* Circle/Support/About */}
      <div className="absolute bottom-8 left-8 w-4 h-4 bg-action rounded-full hoverable-small"></div>
    </Layout>
  );
}
