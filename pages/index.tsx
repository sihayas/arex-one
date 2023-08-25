import { signOut, useSession } from "next-auth/react";
import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TabBar from "@/components/cmdk/pages/album/sub/TabBar";

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
        <Link data-active={isActive("/signup")} href="/api/auth/signin">
          <div className="justify-self-center self-center text-gray2 text-sm">
            log in?
          </div>
        </Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      <div className="justify-self-center self-center text-black text-sm flex items-center gap-4">
        <Image
          className="rounded-full"
          src={session.user.image}
          alt="user avatar"
          width={48}
          height={48}
        />
        <div className="flex flex-col gap-4 translate-y-1/3">
          <div className="">{session.user.name}*</div>
          <div onClick={() => signOut()} className="text-xs text-gray2">
            DISCONNECT
          </div>
        </div>
        <TabBar />
      </div>

      {/* Circle/Support/About */}
      <div className="absolute bottom-8 left-8 w-4 h-4 bg-action rounded-full hoverable-small"></div>
    </Layout>
  );
}
