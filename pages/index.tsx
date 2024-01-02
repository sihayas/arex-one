import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Dash from "@/components/global/Dash";
import { motion } from "framer-motion";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Stream from "@/components/Stream";

export default function Home() {
  const { activeFeed, user, pages, isVisible } = useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();
  const activePage: Page = pages[pages.length - 1];

  if (!user) {
    return (
      <Layout>
        <Head>
          <title>[redacted]</title>
        </Head>
        <div className="m-8 grid h-screen w-screen gap-8 grid-cols-17 grid-rows-11">
          <div className="col-start-1 row-start-1 text-[34px]">VOIR</div>

          <div className="col-span-4 col-start-2 uppercase row-start-1 text-sm tracking-widest text-red animate-pulse duration-500">
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

      {/* Feed */}
      {activeFeed && (
        <motion.div
          ref={scrollContainerRef}
          className={`flex flex-col items-center pt-16 px-8 gap-32 max-h-screen w-full overflow-scroll scrollbar-none`}
        >
          {/*  Blur Backdrop */}
          <div
            className={`absolute top-0 center-x w-full h-full bg-white/0 backdrop-blur-[80px] pointer-events-none z-0`}
          ></div>

          {activeFeed === "bloom" ? (
            <Stream
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"bloom"}
            />
          ) : activeFeed === "personal" ? (
            <Stream
              userId={user.id}
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

          <Image
            className={`rounded-full z-20 -translate-x-[174px] absolute shadow-shadowKitMedium`}
            src={user?.image}
            alt={`${user?.username}'s avatar`}
            width={42}
            height={42}
          />
          <Dash className="absolute z-10 -translate-x-[174px]" />
        </motion.div>
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
