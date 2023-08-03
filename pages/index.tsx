import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import { FeedAlbum } from "@/components/feed/FeedAlbum";
import NavBar from "@/components/nav/Nav";
import { fetchFeed } from "@/lib/api/feedAPI";
import { ActivityData } from "@/lib/interfaces";

export default function Home() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

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

  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      <div className="w-[592px] h-[98vh] bg-[#FFF] border border-silver justify-self-center self-center rounded-[16px] p-8 pb-32 overflow-scroll scrollbar-none">
        {/* Render the feed here using the data */}
        {data?.map((activity: ActivityData) => (
          <div key={activity.id}>
            <FeedAlbum review={activity.review} />
          </div>
        ))}
        <div className="text-xs text-center pt-4 text-gray3 tracking-widest font-medium">
          END OF LINE{" "}
        </div>
        <NavBar />
      </div>
    </Layout>
  );
}
