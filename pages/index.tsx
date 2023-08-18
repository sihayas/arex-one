import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout";
import Head from "next/head";
import React, { useState } from "react";
import NavBar from "@/components/nav/Nav";
import { fetchFeed } from "@/lib/api/feedAPI";
import SpotlightFeed from "@/components/cmdk/pages/feed/sections/SpotlightFeed";
import BloomingFeed from "@/components/cmdk/pages/feed/sections/BloomingFeed";
import UserFeed from "@/components/cmdk/pages/feed/sections/UserFeed";
import { useDragLogic } from "@/hooks/handleInteractions/useDragLogic";
import { animated } from "@react-spring/web";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>rx</title>
        </Head>
        <div className="justify-self-center self-center text-gray2">
          log in?
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      <div className="justify-self-center self-center text-black text-sm">
        hello, {session.user.name}
      </div>

      {/* Circle/Support/About */}
      <div className="absolute bottom-8 left-8 w-4 h-4 bg-action rounded-full hoverable-small"></div>
    </Layout>
  );
}
