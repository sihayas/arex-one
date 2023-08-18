import { signOut, useSession } from "next-auth/react";
import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>rx</title>
        </Head>
        <div className="justify-self-center self-center text-gray2">
          log in?
        </div>
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
            disconnect
          </div>
        </div>
      </div>

      {/* Circle/Support/About */}
      <div className="absolute bottom-8 left-8 w-4 h-4 bg-action rounded-full hoverable-small"></div>
    </Layout>
  );
}
