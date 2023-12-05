import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Dash from "@/components/global/Dash";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserType } from "@/types/dbTypes";
import Image from "next/image";
import Stream from "@/components/Stream";

export default function Home() {
  const { activeFeed, feedHistory, setActiveFeed, setFeedHistory, user } =
    useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();

  const handleAvatarClick = (clickedUser: UserType) => {
    // Move the clicked user to the front of the array
    const reorderedHistory = feedHistory.filter((u) => u.id !== clickedUser.id);
    reorderedHistory.unshift(clickedUser);

    // Update the feedUserHistory and setActiveFeedUser
    setFeedHistory(reorderedHistory);
    setActiveFeed(clickedUser);
  };

  if (!user) {
    return (
      <Layout>
        <Head>
          <title>rx</title>
        </Head>
        <div className="m-8 grid h-screen w-screen gap-8 grid-cols-17 grid-rows-11">
          <div className="col-start-1 row-start-1 text-[34px] font-medium text-[#4733ff] leading-[22px] drop-shadow">
            Rx
          </div>

          <div className="col-span-4 col-start-2 uppercase row-start-1 text-xs tracking-widest text-red -mt-1 animate-pulse">
            pardon our appearance while facade work in progress...
          </div>

          <button
            onClick={async () => {
              const { data, error } = await supabaseClient.auth.signInWithOAuth(
                {
                  provider: "google",
                },
              );
              {
                error ? console.log(error) : console.log(data);
              }
            }}
            className="col-span-5 col-start-2 uppercase row-start-9 text-xs text-gray2 tracking-widest "
          >
            connect
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Rx</title>
      </Head>
      <div
        className={`text-[42px] leading-[33px] text-black absolute top-8 left-8`}
      ></div>

      {activeFeed && (
        <>
          <div className={`flex items-center gap-8`}>
            <Image
              className={`rounded-full`}
              src={user?.image}
              alt={`${user?.username}'s avatar`}
              width={64}
              height={64}
              onClick={() => setActiveFeed(user)}
            />

            {/* Show In Bloom Feed */}
            {/*<motion.button*/}
            {/*  initial={{ opacity: 0.2, scale: 0.75, boxShadow: "none" }}*/}
            {/*  animate={*/}
            {/*    activeFeed === "bloom"*/}
            {/*      ? {*/}
            {/*          opacity: 1,*/}
            {/*          scale: 1,*/}
            {/*          boxShadow:*/}
            {/*            "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",*/}
            {/*        }*/}
            {/*      : {}*/}
            {/*  }*/}
            {/*  transition={{ type: "spring", stiffness: 100, damping: 20 }}*/}
            {/*  onClick={() => setActiveFeed("bloom")}*/}
            {/*  className={`p-1 rounded-full shadow-shadowKitLow relative`}*/}
            {/*>*/}
            {/*  <BloomIcon color={"#999"} />*/}
            {/*  <div*/}
            {/*    className={`absolute left-1/2 -translate-x-1/2 text-xs text-gray2 -top-6 w-max`}*/}
            {/*  >*/}
            {/*    IN BLOOM*/}
            {/*  </div>*/}
            {/*</motion.button>*/}

            {/* Show In Bloom Feed */}
            {/*<motion.button*/}
            {/*  initial={{ opacity: 0.2, scale: 0.75, boxShadow: "none" }}*/}
            {/*  animate={*/}
            {/*    activeFeed === "recent"*/}
            {/*      ? {*/}
            {/*          opacity: 1,*/}
            {/*          scale: 1,*/}
            {/*          boxShadow:*/}
            {/*            "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",*/}
            {/*        }*/}
            {/*      : {}*/}
            {/*  }*/}
            {/*  transition={{ type: "spring", stiffness: 100, damping: 20 }}*/}
            {/*  onClick={() => setActiveFeed("recent")}*/}
            {/*  className={`p-1 rounded-full shadow-shadowKitLow relative`}*/}
            {/*>*/}
            {/*  <RecentIcon color={"#999"} />*/}
            {/*  <div*/}
            {/*    className={`absolute left-1/2 -translate-x-1/2 text-xs text-gray2 -top-6 w-max`}*/}
            {/*  >*/}
            {/*    RECENT*/}
            {/*  </div>*/}
            {/*</motion.button>*/}

            {/*    */}
          </div>

          <Dash className="absolute translate-x-[190px] translate-y-8" />

          {/* Feeds or Profile artifacts Container */}
          <motion.div
            ref={scrollContainerRef}
            className={`relative flex flex-col gap-[50px] pl-0 p-12 pb-60 pt-28 max-w-screen max-h-[125vh] overflow-scroll scrollbar-none`}
          >
            {scrollContainerRef && (
              <>
                {activeFeed === "bloom" ? (
                  <Stream
                    userId={user.id}
                    scrollContainerRef={scrollContainerRef}
                    type={"bloom"}
                  />
                ) : activeFeed === user ? (
                  <Stream
                    userId={activeFeed.id}
                    scrollContainerRef={scrollContainerRef}
                    type={"personal"}
                  />
                ) : activeFeed === "recent" ? (
                  <Stream
                    userId={user.id}
                    scrollContainerRef={scrollContainerRef}
                    type={"recent"}
                  />
                ) : null}
              </>
            )}
          </motion.div>
        </>
      )}

      {/* DISCONNECT */}
      <button
        className="fixed bottom-0 left-0 cursor-pointer text-sm uppercase text-gray3 hover:text-red/60 z-50"
        onClick={async () => {
          const { error } = await supabaseClient.auth.signOut();
        }}
      >
        CONNECTED
      </button>
    </Layout>
  );
}
