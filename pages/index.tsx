import { signOut, useSession } from "next-auth/react";
import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TabBar from "@/components/interface/pages/album/sub/TabBar";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>rx</title>
        </Head>
        {/* <Link data-active={isActive("/signup")} href="/api/auth/signin">
          <div className="justify-self-center self-center text-gray2 text-sm">
            log in?
          </div>
        </Link> */}
        <div className="row-start-1 col-start-1 text-sm text-black font-medium">
          RX
        </div>
        <div className="flex flex-col row-start-1 col-start-2 col-span-5 text-sm justify-between ">
          <div className="text-black tracking-widest">
            A DIGITAL METROPOLIS FOR THE LOVE OF{" "}
            <span className="font-medium tracking-normal">SOUND*</span>
          </div>
          <div className="text-gray2">
            HEARING BRINGS US INTO THE LIVING WORLD, SIGHT MOVES US TOWARDS
            ATROPHY & DEATH.
          </div>
        </div>

        <div className="row-start-3 col-start-3 col-span-5 self-end text-sm text-gray2 uppercase">
          MORE THAN JUST A FEED
        </div>

        <div className="flex flex-col justify-evenly row-start-4 col-start-3 col-span-5 text-sm text-gray2 uppercase ">
          <div className="">Define</div>
          <div className="">Express</div>
          <div className="">Interlink</div>
        </div>

        <div className="row-start-5 row-span-1 col-start-3 col-span-4 items-end text-sm text-gray2 uppercase">
          <span className="text-black">RX</span> exists for those few and far
          between, to revel in the shared love for the inviisble waves that bind
          us.
        </div>

        <div className="row-start-9 col-start-2 col-span-5 self-end text-sm text-gray2 uppercase">
          <Link data-active={isActive("/signup")} href="/api/auth/signin">
            CONNECT WITH <span className="text-red">APPLE MUSIC</span>...
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>
      <div className="row-start-1 col-start-1 text-sm text-black">RX</div>
      <div
        className="row-start-9 col-start-2 self-end text-sm text-gray3 uppercase hover:text-red/60 cursor-pointer"
        onClick={() => signOut()}
        onMouseOver={(e) => (e.currentTarget.textContent = "DISCONNECT")}
        onMouseOut={(e) => (e.currentTarget.textContent = "CONNECTED")}
      >
        CONNECTED
      </div>
      <div className="flex flex-col justify-between row-start-10 col-start-2 col-span-5 text-sm text-gray2 uppercase">
        <div className="font-semibold text-black tracking-widest">
          {session.user.name}
        </div>
        <div className="text-gray2">
          Is there a &apos;Fountain of Eternal Melody&apos; for you — a song
          that never ages or loses its charm?
        </div>
      </div>
      <div className="row-start-11 col-start-2 col-span-5">
        <div className="w-4 h-4 bg-action rounded-full hoverable-small"></div>
      </div>
    </Layout>
  );
}
