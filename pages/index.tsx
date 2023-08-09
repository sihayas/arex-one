import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout";
import Head from "next/head";
import React, { useState } from "react";
import { FeedAlbum } from "@/components/feed/FeedAlbum";
import NavBar from "@/components/nav/Nav";
import { fetchFeed } from "@/lib/api/feedAPI";
import { ActivityData } from "@/lib/interfaces";
import SpotlightFeed from "@/components/feed/SpotlightFeed";
import BloomingFeed from "@/components/feed/BloomingFeed";
import { useDragLogic } from "@/hooks/npm/useDragLogic";
import { animated } from "@react-spring/web";

export default function Home() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentFeed, setCurrentFeed] = useState("default");

  const navigateLeft = () => {
    if (currentFeed === "spotlight") setCurrentFeed("blooming");
    else if (currentFeed === "blooming") setCurrentFeed("default");
  };

  const navigateRight = () => {
    if (currentFeed === "default") setCurrentFeed("blooming");
    else if (currentFeed === "blooming") setCurrentFeed("spotlight");
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
      // use your spotlight fetching logic here
      feedContent = <SpotlightFeed />;
      break;
    case "blooming":
      // use your blooming fetching logic here
      feedContent = <BloomingFeed />;
      break;
    default:
      feedContent = data.map((activity: ActivityData, index: number) => (
        <div key={activity.id} className={index > 0 ? "pt-4" : ""}>
          <FeedAlbum review={activity.review} />
        </div>
      ));
      break;
  }

  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      <div className="w-[592px] h-[98vh] border border-silver justify-self-center self-center rounded-[16px] overflow-hidden ">
        {/* Render the feed here using the data */}
        <animated.div
          style={{
            x,
            ...scaleSpring,
          }}
          {...bind()}
          className="bg-white w-full h-full p-8 overflow-scroll scrollbar-none border border-silver rounded-[16px]"
        >
          {feedContent}
        </animated.div>
        <NavBar />
      </div>
    </Layout>
  );
}
