import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Dash from "@/components/index/items/Dash";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import Artifacts from "@/components/index/render/Artifacts";
import Link from "next/link";
import Avatar from "@/components/global/Avatar";
import { AppleIcon } from "@/components/icons";
import { Player } from "@/components/global/Player";

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
    // Handle the response, e.g., redirect to the homepage
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
        <div className="h-screen w-screen flex">
          <div className={`w-[448px] h-full p-16 home-container`}>
            <p
              className={`col-span-3 row-span-1 font-semibold text-[22px] tracking-tighter leading-[16px`}
            >
              Voir
            </p>

            <div
              className={`row-start-3 row-span-2 col-span-full flex items-center gap-1 -ml-12`}
            >
              <Link
                href="/api/oauth/apple/login"
                className={`bg-white rounded-max min-w-[2rem] h-8 relative shadow-shadowKitHigh`}
              >
                <AppleIcon className={`absolute center-y center-x`} />
              </Link>
              <div className={`bg-gray3 rounded-full min-w-[2px] h-0.5`} />
              <div className={`bg-gray3 rounded-full min-w-[2px] h-0.5`} />
              <div className={`bg-gray3 rounded-full min-w-[2px] h-0.5`} />
              <div className={`bg-gray3 rounded-full w-full h-0.5`} />
            </div>

            <>
              <p
                className={`row-start-6 col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                In this haven of harmonies
              </p>
              <p
                className={`ml-auto row-start-[8] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                interaction is a delicate dance
              </p>

              <p
                className={`ml-4 row-start-[10] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                of digits across screens
              </p>

              <p
                className={`ml-8 row-start-[12] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                a silent symphony shared
              </p>

              <p
                className={`row-start-[14] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                Users
              </p>

              <p
                className={`row-start-[16] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                as intertwined melodies
              </p>

              <p
                className={`ml-16 row-start-[18] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                resonate in a silent pact
              </p>

              <p
                className={`ml-16 row-start-[20] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                bound by the unseen thread of rhythm
              </p>

              <p
                className={`ml-auto row-start-[22] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                Here
              </p>

              <p
                className={`ml-[111px] row-start-[24] col-span-full font-garamond12 leading-[10px] italic text-lg`}
              >
                a song sent is a soul’s whisper
              </p>

              <p
                className={`ml-5 row-start-[26] col-span-full font-garamond12 leading-[10px] italic text-lg`}
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
          className={`flex flex-col items-center pt-16 px-8 pb-32 gap-32 max-h-screen w-full overflow-scroll scrollbar-none`}
        >
          {/*  Blur Backdrop */}
          <div
            className={`absolute top-0 center-x w-full h-full bg-white/50 backdrop-blur-[72px] pointer-events-none z-0`}
          />

          {activeFeed === "bloom" ? (
            <Artifacts
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"bloom"}
            />
          ) : activeFeed === "personal" ? (
            <Artifacts
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"personal"}
            />
          ) : activeFeed === "recent" ? (
            <Artifacts
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"recent"}
            />
          ) : null}

          <Avatar
            className="rounded-full z-20 -translate-x-[157px] absolute shadow-shadowKitMedium"
            imageSrc={user.image}
            altText={`avatar`}
            width={42}
            height={42}
            user={user}
          />

          <Dash className="absolute z-0 -translate-x-[157px]" />
        </motion.div>
      )}

      <Player />

      <button
        className="fixed bottom-0 left-0 cursor-pointer text-sm uppercase text-gray3 hover:text-red/60 z-50"
        onClick={handleLogout}
      >
        Disconnect
      </button>
    </Layout>
  );
}
