import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Dash from "@/components/global/Dash";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Stream from "@/components/Stream";

export default function Home() {
  const { activeFeed, user } = useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();

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
          <div className={`absolute left-[167px] flex items-center gap-8`}>
            <Image
              className={`rounded-full`}
              src={user?.image}
              alt={`${user?.username}'s avatar`}
              width={48}
              height={48}
            />
          </div>

          <Dash className="absolute translate-x-[190px]" />

          {/* Feeds */}
          <motion.div
            ref={scrollContainerRef}
            className={`flex flex-col items-center pt-16 gap-16 max-h-[125vh] w-fit overflow-scroll scrollbar-none -ml-[224px]`}
          >
            {/*  Blur Backdrop */}
            <div
              className={`absolute top-0 left-0 w-full h-full bg-white/0 backdrop-blur-3xl pointer-events-none z-0`}
            ></div>
            {scrollContainerRef && (
              <>
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
