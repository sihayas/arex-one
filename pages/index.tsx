import { signOut, useSession } from "next-auth/react";
import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeedUser from "@/components/index/feed/FeedUser";
import UserAvatar from "@/components/global/UserAvatar";
import Line from "@/components/interface/entry/sub/icons/Line";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  if (status === "loading") {
    return <div>loading </div>; // or some other placeholder
  }

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
            <Link data-active={isActive("/signup")} href="/api/auth/signin">
              CONNECT WITH <span className="text-red">APPLE MUSIC</span>...
            </Link>
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

      <div className="absolute flex translate-x-12 translate-y-12 flex-col">
        <UserAvatar
          className="border-2 border-[#F4F4F4]"
          imageSrc={session.user.image}
          altText={`${session.user.name}'s avatar`}
          width={48}
          height={48}
          userId={session.user.id}
        />
        <Line className="absolute translate-x-6 z-0" height="100vh" />
      </div>

      <div className="relative z-10 flex max-h-screen flex-col gap-10 overflow-scroll pl-10 p-12 pt-32 max-w-screen">
        <FeedUser userId={session.user.id} />
      </div>

      <div
        className="fixed bottom-0 left-0 cursor-pointer text-sm uppercase text-gray3 hover:text-red/60"
        onClick={() => signOut()}
        onMouseOver={(e) => (e.currentTarget.textContent = "DISCONNECT")}
        onMouseOut={(e) => (e.currentTarget.textContent = "CONNECTED")}
      >
        CONNECTED
      </div>
    </Layout>
  );
}
