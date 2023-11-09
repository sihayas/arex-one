import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import FeedUser from "@/components/feed/FeedUser";
import UserAvatar from "@/components/global/UserAvatar";
import DashedLine from "@/components/interface/record/sub/icons/DashedLine";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import RatingDial from "@/components/interface/album/sub/RatingDial";

export default function Home() {
  const { user, session } = useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>rx</title>
        </Head>
        <div className="m-8 grid h-screen w-screen gap-8 grid-cols-17 grid-rows-11">
          <div className="col-start-1 row-start-1 text-sm font-medium text-black">
            AREX [alpha]
          </div>
          <div className="col-span-5 col-start-2 row-start-1 flex flex-col justify-between text-xs">
            <div className="tracking-widest text-black">
              A NETWORK FOR THE LOVE OF
              <span className="font-medium tracking-normal"> SOUND*</span>
            </div>
            <div className="text-gray2 tracking-widest italic font-baskerville text-sm">
              HEARING BRINGS US INTO THE LIVING WORLD, SIGHT MOVES US TOWARDS
              ATROPHY & DEATH.
            </div>
          </div>

          <div className="col-span-5 col-start-3 row-start-3 self-end uppercase text-gray2 text-xs tracking-widest">
            MORE THAN JUST A FEED
          </div>

          <div className="col-span-4 col-start-3 row-span-1 row-start-5 items-end text-xs tracking-widest uppercase text-gray2">
            <span className="text-black">AREX</span> exists for those few and
            far between, to revel in the shared love for the invisible waves
            that bind us.
            {/* <span className="text-black">AREX</span> exists for ...., to ... that
          bind us. */}
          </div>

          <div className="col-span-5 col-start-2 self-end uppercase row-start-9 text-xs tracking-widest bg-red text-white shadow-album leading-[75%] p-2 rounded font-medium">
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
              CONNECT WITH APPLE MUSIC
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

      <UserAvatar
        className="fixed translate-x-[175px] translate-y-12 z-50"
        imageSrc={user?.image}
        altText={`${user?.username}'s avatar`}
        width={32}
        height={32}
        //@ts-ignore
        user={session.user}
      />
      <DashedLine className="absolute translate-x-[190px] translate-y-12" />

      <motion.div
        ref={scrollContainerRef}
        className={`relative flex flex-col gap-[50px] overflow-scroll pl-0 p-12 pb-0 pt-32 max-w-screen max-h-[125vh] origin-left scrollbar-none`}
      >
        {scrollContainerRef && user && (
          <FeedUser userId={user.id} scrollContainerRef={scrollContainerRef} />
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
