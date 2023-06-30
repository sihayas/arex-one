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
    </Layout>
  );
}
