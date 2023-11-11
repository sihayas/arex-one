import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import FeedUser from "@/components/feed/FeedUser";
import UserAvatar from "@/components/global/UserAvatar";
import DashedLine from "@/components/interface/record/sub/icons/DashedLine";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { User } from "@/types/dbTypes";

const springConfig = { type: "spring", damping: 14, stiffness: 100 };

export default function Home() {
  const {
    activeFeedUser,
    feedUserHistory,
    setActiveFeedUser,
    setFeedUserHistory,
    user,
  } = useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();
  const isProfile = activeFeedUser?.id !== user?.id;

  const handleAvatarClick = (clickedUser: User) => {
    // Move the clicked user to the front of the array
    const reorderedHistory = feedUserHistory.filter(
      (u) => u.id !== clickedUser.id,
    );
    reorderedHistory.unshift(clickedUser);

    // Update the feedUserHistory and setActiveFeedUser
    setFeedUserHistory(reorderedHistory);
    setActiveFeedUser(clickedUser);
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
          {/*<div className="col-span-5 col-start-2 row-start-1 flex flex-col justify-between text-xs">*/}
          {/*  <div className="tracking-widest text-black">*/}
          {/*    A NETWORK FOR THE LOVE OF*/}
          {/*    <span className="font-medium tracking-normal"> SOUND*</span>*/}
          {/*  </div>*/}
          {/*  <div className="text-gray2 tracking-widest italic font-baskerville text-sm">*/}
          {/*    HEARING BRINGS US INTO THE LIVING WORLD, SIGHT MOVES US TOWARDS*/}
          {/*    ATROPHY & DEATH.*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className="col-span-5 col-start-3 row-start-3 self-end uppercase text-gray2 text-xs tracking-widest">*/}
          {/*  MORE THAN JUST A FEED*/}
          {/*</div>*/}

          {/*<div className="col-span-4 col-start-3 row-span-1 row-start-5 items-end text-xs tracking-widest uppercase text-gray2">*/}
          {/*  <span className="text-black">AREX</span> exists for those few and*/}
          {/*  far between, to revel in the shared love for the invisible waves*/}
          {/*  that bind us.*/}
          {/*  /!* <span className="text-black">AREX</span> exists for ...., to ... that*/}
          {/*bind us. *!/*/}
          {/*</div>*/}

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

  // User data is stored in interface context
  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      {activeFeedUser && (
        <div
          className={`flex items-center gap-2 fixed w-full translate-y-8 -z-20`}
        >
          <motion.div
            layout
            initial={{ y: 0 }}
            animate={activeFeedUser.id !== user?.id ? { x: 40 } : {}}
            transition={springConfig}
            className={`flex items-center justify-end w-[167px] gap-1`}
          >
            {feedUserHistory
              .slice()
              .reverse()
              .map((historyUser, index) => (
                <motion.div
                  key={historyUser.id}
                  layout
                  layoutId={historyUser.id}
                  animate={{
                    scale:
                      activeFeedUser.id === user?.id
                        ? 0.75
                        : activeFeedUser.id === historyUser.id
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

          {/* Authenticated User */}
          <div className={`flex items-center gap-2`}>
            {/* Shift the auth user up to make space for another */}
            <motion.div
              initial={{ y: 0 }}
              animate={activeFeedUser?.id !== user?.id ? { y: -46 } : {}}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={() => setActiveFeedUser(user)}
              className={`cursor-pointer`}
            >
              <UserAvatar
                imageSrc={user?.image}
                altText={`${user?.username}'s avatar`}
                width={32}
                height={32}
                user={activeFeedUser}
                onClick={() => setActiveFeedUser(user)}
              />
            </motion.div>

            {/* Active Feed Username */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`text-gray2 text-xs font-medium uppercase`}
            >
              {isProfile
                ? `${activeFeedUser.username}&apos; profile`
                : "What's" + " the" + " anthem of your personal utopia?"}
            </motion.div>
          </div>
        </div>
      )}

      <DashedLine className="absolute translate-x-[190px] translate-y-8" />

      {/* Show Auth Feed or Profile Records */}
      <motion.div
        ref={scrollContainerRef}
        className={`relative flex flex-col gap-[50px] overflow-scroll pl-0 p-12 pb-0 pt-28 max-w-screen max-h-[125vh] scrollbar-none`}
      >
        {scrollContainerRef && activeFeedUser && (
          <FeedUser
            userId={activeFeedUser.id}
            scrollContainerRef={scrollContainerRef}
          />
        )}
      </motion.div>

      <button
        className="fixed bottom-0 left-0 cursor-pointer text-sm uppercase text-gray3 hover:text-red/60 z-50"
        onClick={async () => {
          console.log("signing out");
          const { error } = await supabaseClient.auth.signOut();
          {
            error ? console.log(error) : console.log("signed out");
          }
        }}
      >
        CONNECTED
      </button>
    </Layout>
  );
}
