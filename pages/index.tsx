import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import { FeedAlbum } from "@/components/home/FeedAlbum";

// This fetch function is used by react-query
async function fetchFeed(userId) {
  console.log("Fetching feed for UserId:", userId); // Add this line
  const res = await axios.get(`/api/feed/getActivities?userId=${userId}`);
  return res.data;
}

export default function Home() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading, error } = useQuery(
    ["feed", userId],
    () => fetchFeed(userId),
    {
      enabled: !!userId,
    }
  );

  if (isLoading) return "Loading...";

  if (error) return `An error has occurred`;
  console.log(data);

  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      <div className="w-[576px] h-[1022px] border border-silver justify-self-center self-center rounded-[32px] p-8 overflow-scroll scrollbar-none">
        {/* Render the feed here using the data */}
        {data?.map((activity) => (
          <div key={activity.id}>
            <FeedAlbum review={activity.review} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
