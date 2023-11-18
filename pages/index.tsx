import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import FeedUser from "@/components/feed/FeedUser";
import FeedTrending from "@/components/feed/FeedTrending";
import FeedRecent from "@/components/feed/FeedRecent";
import UserAvatar from "@/components/global/UserAvatar";
import DashedLine from "@/components/interface/record/sub/icons/DashedLine";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { User } from "@/types/dbTypes";
import { BloomIcon, RecentIcon } from "@/components/icons";
import Image from "next/image";

const springConfig = { type: "spring", damping: 14, stiffness: 100 };

export default function Home() {
  const { activeFeed, feedHistory, setActiveFeed, setFeedHistory, user } =
    useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();

  const handleAvatarClick = (clickedUser: User) => {
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
          <div className="col-start-1 row-start-1 text-sm font-medium text-black">
            AREX [alpha]
          </div>

          <div className="col-span-5 col-start-2 self-end uppercase row-start-9 text-xs tracking-widest text-red shadow-album leading-[75%] p-2 rounded font-medium">
            <button
              onClick={async () => {
                const { data, error } =
                  await supabaseClient.auth.signInWithOAuth({
                    provider: "google",
                  });
                {
                  error ? console.log(error) : console.log(data);
                }
              }}
            >
              CONNECT WITH GOOGLE
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>
      <div
        className={`text-sm text-[#000] font-serif absolute top-4 left-4 drop-shadow-sm`}
      >
        RX
      </div>

      {activeFeed && (
        <>
          {/* Stack of User History for Feed */}
          <div
            className={`flex items-center gap-2 fixed w-full translate-y-8 z-50`}
          >
            {/* History Images Stack / Left Side */}
            <motion.div
              layout
              initial={{ y: 0 }}
              animate={
                activeFeed === user && activeFeed.id !== user.id
                  ? { x: 40 }
                  : {}
              }
              transition={springConfig}
              className={`flex items-center justify-end w-[167px] gap-1`}
            >
              {feedHistory
                .slice()
                .reverse()
                .map((historyUser) => (
                  <motion.div
                    key={historyUser.id}
                    layout
                    layoutId={historyUser.id}
                    animate={{
                      scale:
                        activeFeed === user && activeFeed.id === user.id
                          ? 0.75
                          : activeFeed === user &&
                            activeFeed.id === historyUser.id
                          ? 1
                          : 0.75,
                    }}
                    transition={springConfig}
                  >
                    <UserAvatar
                      className=""
                      imageSrc={historyUser.image}
                      altText={`${historyUser.username}'s avatar`}
                      width={32}
                      height={32}
                      user={historyUser}
                      onClick={() => handleAvatarClick(historyUser)}
                    />
                  </motion.div>
                ))}
            </motion.div>

            {/*  Right Side / Authenticated User & Other Feeds */}
            <div className={`flex items-center gap-8`}>
              {/* Shift the auth user up to make space for another */}
              <motion.div
                initial={{ y: 0 }}
                animate={
                  (typeof activeFeed === "string" && activeFeed === "bloom") ||
                  activeFeed === "recent"
                    ? { scale: 0.75 }
                    : typeof activeFeed !== "string" &&
                      activeFeed.id !== user.id
                    ? { y: -46 }
                    : {}
                }
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                onClick={() => setActiveFeed(user)}
                className={`cursor-pointer`}
              >
                <Image
                  className={`rounded-full`}
                  src={user?.image}
                  alt={`${user?.username}'s avatar`}
                  width={32}
                  height={32}
                  onClick={() => setActiveFeed(user)}
                />
              </motion.div>

              {/* Show In Bloom Feed */}
              <motion.button
                initial={{ opacity: 0.2, scale: 0.75, boxShadow: "none" }}
                animate={
                  activeFeed === "bloom"
                    ? {
                        opacity: 1,
                        scale: 1,
                        boxShadow:
                          "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
                      }
                    : {}
                }
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                onClick={() => setActiveFeed("bloom")}
                className={`p-1 rounded-full shadow-shadowKitLow relative`}
              >
                <BloomIcon color={"#999"} />
                <div
                  className={`absolute left-1/2 -translate-x-1/2 text-xs text-gray2 -top-6 w-max`}
                >
                  IN BLOOM
                </div>
              </motion.button>

              {/* Show In Bloom Feed */}
              <motion.button
                initial={{ opacity: 0.2, scale: 0.75, boxShadow: "none" }}
                animate={
                  activeFeed === "recent"
                    ? {
                        opacity: 1,
                        scale: 1,
                        boxShadow:
                          "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
                      }
                    : {}
                }
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                onClick={() => setActiveFeed("recent")}
                className={`p-1 rounded-full shadow-shadowKitLow relative`}
              >
                <RecentIcon color={"#999"} />
                <div
                  className={`absolute left-1/2 -translate-x-1/2 text-xs text-gray2 -top-6 w-max`}
                >
                  RECENT
                </div>
              </motion.button>
            </div>
          </div>

          <DashedLine className="absolute translate-x-[190px] translate-y-8" />

          {/* Feeds or Profile Records Container */}
          <motion.div
            ref={scrollContainerRef}
            className={`relative flex flex-col gap-[50px] pl-0 p-12 pb-60 pt-28 max-w-screen max-h-[125vh] overflow-scroll scrollbar-none`}
          >
            {scrollContainerRef && (
              <>
                {activeFeed === "bloom" ? (
                  <FeedTrending
                    userId={user.id}
                    scrollContainerRef={scrollContainerRef}
                  />
                ) : activeFeed === user ? (
                  <FeedUser
                    userId={activeFeed.id}
                    scrollContainerRef={scrollContainerRef}
                  />
                ) : activeFeed === "recent" ? (
                  <FeedRecent
                    userId={user.id}
                    scrollContainerRef={scrollContainerRef}
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
