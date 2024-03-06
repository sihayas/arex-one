import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Dash from "@/components/index/items/Dash";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import Feed from "@/components/index/render/Feed";
import Link from "next/link";
import Avatar from "@/components/global/Avatar";
import { AppleIcon } from "@/components/icons";

type Feed = "personal" | "bloom" | "recent" | null;

export default function Home() {
  const { user } = useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const [activeFeed, setActiveFeed] = React.useState<Feed>("personal");

  const handleLogout = async () => {
    // Make a POST request to the logout API endpoint
    const response = await fetch("/api/oauth/apple/logout", {
      method: "POST",
    });
    // Handle the response, e.g., redirect to home
    if (response.ok) {
      window.location.href = "/";
    }
  };

  if (!user) {
    return (
      <Layout>
        <Head>
          <title>VOIR</title>
        </Head>
        <div className="flex h-screen w-screen">
          <div className={`home-container h-full w-[448px] p-16`}>
            <p
              className={`leading-[16px col-span-3 row-span-1 text-[22px] font-semibold tracking-tighter`}
            >
              Voir
            </p>

            <div
              className={`col-span-full row-span-2 row-start-3 -ml-12 flex items-center gap-1`}
            >
              <Link
                href="/api/oauth/apple/login"
                className={`rounded-max shadow-shadowKitHigh relative h-8 min-w-[2rem] bg-white`}
              >
                <AppleIcon className={`center-y center-x absolute`} />
              </Link>
              <div className={`bg-gray3 h-0.5 min-w-[2px] rounded-full`} />
              <div className={`bg-gray3 h-0.5 min-w-[2px] rounded-full`} />
              <div className={`bg-gray3 h-0.5 min-w-[2px] rounded-full`} />
              <div className={`bg-gray3 h-0.5 w-full rounded-full`} />
            </div>

            <>
              <p
                className={`font-garamond12 col-span-full row-start-6 text-lg italic leading-[10px]`}
              >
                In this haven of harmonies
              </p>
              <p
                className={`font-garamond12 col-span-full row-start-[8] ml-auto text-lg italic leading-[10px]`}
              >
                interaction is a delicate dance
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[10] ml-4 text-lg italic leading-[10px]`}
              >
                of digits across screens
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[12] ml-8 text-lg italic leading-[10px]`}
              >
                a silent symphony shared
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[14] text-lg italic leading-[10px]`}
              >
                Users
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[16] text-lg italic leading-[10px]`}
              >
                as intertwined melodies
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[18] ml-16 text-lg italic leading-[10px]`}
              >
                resonate in a silent pact
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[20] ml-16 text-lg italic leading-[10px]`}
              >
                bound by the unseen thread of rhythm
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[22] ml-auto text-lg italic leading-[10px]`}
              >
                Here
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[24] ml-[111px] text-lg italic leading-[10px]`}
              >
                a song sent is a soul’s whisper
              </p>

              <p
                className={`font-garamond12 col-span-full row-start-[26] ml-5 text-lg italic leading-[10px]`}
              >
                a shared pulse within the vast digital expanse
              </p>
            </>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Rx</title>
      </Head>

      {/* Feed */}
      {activeFeed && (
        <motion.div
          ref={scrollContainerRef}
          className={`scrollbar-none flex max-h-screen w-full flex-col items-center gap-32 overflow-scroll px-8 pb-32 pt-16`}
        >
          {/*  Blur Backdrop */}
          <div
            className={`center-x pointer-events-none absolute top-0 z-0 h-full w-full bg-white/50 backdrop-blur-[72px]`}
          />

          {activeFeed === "bloom" ? (
            <Feed
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"bloom"}
            />
          ) : activeFeed === "personal" ? (
            <Feed
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"personal"}
            />
          ) : activeFeed === "recent" ? (
            <Feed
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"recent"}
            />
          ) : null}

          <Avatar
            className="shadow-shadowKitMedium absolute z-20 -translate-x-[157px] rounded-full"
            imageSrc={user.image}
            altText={`avatar`}
            width={42}
            height={42}
            user={user}
          />

          <Dash className="absolute z-0 -translate-x-[157px]" />
        </motion.div>
      )}

      {/*<Player />*/}

      <button
        className="text-gray3 hover:text-red/60 fixed bottom-0 left-0 z-50 cursor-pointer text-sm uppercase"
        onClick={handleLogout}
      >
        Disconnect
      </button>
    </Layout>
  );
}
