import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import FeedUser from "@/components/feed/FeedUser";
import UserAvatar from "@/components/global/UserAvatar";
import DashedLine from "@/components/interface/entry/sub/icons/DashedLine";
import { motion } from "framer-motion";
// import { supabase } from "@/lib/global/supabase";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/global/supabase";

export default function Home() {
  const { user, session } = useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();

  console.log(session, "no session");
  console.log(user, "no user");

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
          <div className="col-span-5 col-start-2 row-start-1 flex flex-col justify-between text-sm">
            <div className="tracking-widest text-black">
              A NETWORK FOR THE LOVE OF
              <span className="font-medium tracking-normal"> SOUND*</span>
            </div>
            <div className="text-gray2">
              HEARING BRINGS US INTO THE LIVING WORLD, SIGHT MOVES US TOWARDS
              ATROPHY & DEATH.
            </div>
          </div>

          <div className="col-span-5 col-start-3 row-start-3 self-end text-sm uppercase text-gray2">
            MORE THAN JUST A FEED
          </div>

          <div className="col-span-5 col-start-3 row-start-4 flex flex-col justify-evenly text-sm uppercase text-gray2">
            <div className="">PLACE</div>
            <div className="">HOLD</div>
            <div className="">ER</div>
          </div>

          <div className="col-span-4 col-start-3 row-span-1 row-start-5 items-end text-sm uppercase text-gray2">
            <span className="text-black">AREX</span> exists for those few and
            far between, to revel in the shared love for the invisible waves
            that bind us.
            {/* <span className="text-black">AREX</span> exists for ...., to ... that
          bind us. */}
          </div>

          <div className="col-span-5 col-start-2 self-end text-sm uppercase row-start-9 text-gray2">
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
              Sign in with Google
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

      {/*<UserAvatar*/}
      {/*  className="fixed translate-x-[138px] translate-y-12 z-50 outline outline-[#FFF] outline-1"*/}
      {/*  imageSrc={user?.image}*/}
      {/*  altText={`${user?.user_metadata.avatar_url}'s avatar`}*/}
      {/*  width={32}*/}
      {/*  height={32}*/}
      {/*  //@ts-ignore*/}
      {/*  user={session.user}*/}
      {/*/>*/}
      <DashedLine
        className="absolute translate-x-[153px] translate-y-12"
        height="100vh"
      />

      {/*<motion.div*/}
      {/*  ref={scrollContainerRef}*/}
      {/*  className="relative flex max-h-screen flex-col gap-10 overflow-scroll pl-0 p-12 pt-32 max-w-screen"*/}
      {/*>*/}
      {/*  {scrollContainerRef && user && (*/}
      {/*    <FeedUser userId={user.id} scrollContainerRef={scrollContainerRef} />*/}
      {/*  )}*/}
      {/*</motion.div>*/}

      <button
        className="fixed bottom-0 left-0 cursor-pointer text-sm uppercase text-gray3 hover:text-red/60 z-50"
        onClick={async () => {
          console.log("signing out");
          const { error } = await supabaseClient.auth.signOut();
          {
            error ? console.log(error) : console.log("signed out");
          }
        }}
        onMouseOver={(e) => (e.currentTarget.textContent = "DISCONNECT")}
        onMouseOut={(e) => (e.currentTarget.textContent = "CONNECTED")}
      >
        CONNECTED
      </button>
    </Layout>
  );
}
