import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Dash from "@/components/global/Dash";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import RenderArtifacts from "@/components/index/RenderArtifacts";
import Link from "next/link";
import Avatar from "@/components/global/Avatar";

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
          <title>[redacted]</title>
        </Head>
        <div className="m-8 grid h-screen w-screen gap-8 grid-cols-17 grid-rows-11">
          <div className="col-start-1 row-start-1 text-[34px]">VOIR</div>

          <div className="col-span-4 col-start-2 uppercase row-start-1 text-sm tracking-widest text-red animate-pulse duration-500">
            pardon our appearance while facade work in progress...
          </div>

          <Link
            className="col-span-5 col-start-2 uppercase row-start-9 text-xs text-gray2 tracking-widest "
            href="/api/oauth/apple/login"
          >
            Sign in with Apple
          </Link>
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
            className={`absolute top-0 center-x w-full h-full bg-white/5 backdrop-blur-[72px] pointer-events-none z-0`}
          />

          {activeFeed === "bloom" ? (
            <RenderArtifacts
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"bloom"}
            />
          ) : activeFeed === "personal" ? (
            <RenderArtifacts
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"personal"}
            />
          ) : activeFeed === "recent" ? (
            <RenderArtifacts
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

      <button
        className="fixed bottom-0 left-0 cursor-pointer text-sm uppercase text-gray3 hover:text-red/60 z-50"
        onClick={handleLogout}
      >
        Disconnect
      </button>
    </Layout>
  );
}
