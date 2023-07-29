import { getSession } from "next-auth/react";
import Layout from "../components/layout";
import Head from "next/head";

import React from "react";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>rx</title>
      </Head>

      <div className="w-[576px] h-[1022px] border border-silver justify-self-center self-center rounded-[32px]"></div>
    </Layout>
  );
}
