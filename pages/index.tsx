import { signOut, useSession } from "next-auth/react";
import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FeedUser from "@/components/index/feed/FeedUser";
import UserAvatar from "@/components/global/UserAvatar";
import Line from "@/components/interface/pages/entry/sub/icons/Line";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  if (status === "loading") {
    return <div>&nbsp;</div>; // or some other placeholder
  }

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>rx</title>
        </Head>
        <div className="h-screen w-screen grid grid-cols-17 grid-rows-11 gap-8 m-8 ">
          <div className="row-start-1 col-start-1 text-sm text-black font-medium">
            AREX [alpha]
          </div>
          <div className="flex flex-col row-start-1 col-start-2 col-span-5 text-sm justify-between ">
            <div className="text-black tracking-widest">
              A NETWORK FOR THE LOVE OF
              <span className="font-medium tracking-normal"> SOUND*</span>
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
            <div className="">PLACE</div>
            <div className="">HOLD</div>
            <div className="">ER</div>
          </div>

          <div className="row-start-5 row-span-1 col-start-3 col-span-4 items-end text-sm text-gray2 uppercase">
            <span className="text-black">AREX</span> exists for those few and
            far between, to revel in the shared love for the invisible waves
            that bind us.
            {/* <span className="text-black">AREX</span> exists for ...., to ... that
          bind us. */}
          </div>

          <div className="row-start-9 col-start-2 col-span-5 self-end text-sm text-gray2 uppercase">
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

      <div className="flex flex-col translate-x-12 translate-y-12 absolute z-20">
        <UserAvatar
          className="border-2 border-[#F4F4F4]"
          imageSrc={session.user.image}
          altText={`${session.user.name}'s avatar`}
          width={48}
          height={48}
          userId={session.user.id}
        />
        <Line className="absolute translate-x-6" height="100vh" />
      </div>

      <div className="flex flex-col overflow-scroll max-h-screen max-w-screen gap-10 p-12 pt-24 relative z-10">
        <FeedUser userId={session.user.id} />
      </div>

      <div
        className="fixed bottom-0 left-0 text-sm text-gray3 uppercase hover:text-red/60 cursor-pointer"
        onClick={() => signOut()}
        onMouseOver={(e) => (e.currentTarget.textContent = "DISCONNECT")}
        onMouseOut={(e) => (e.currentTarget.textContent = "CONNECTED")}
      >
        CONNECTED
      </div>
    </Layout>
  );
}
