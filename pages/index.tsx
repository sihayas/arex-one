import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import { useInterfaceContext } from "@/context/Interface";

import SignedOut from "@/components/index/SignedOut";
import SignedIn from "@/components/index/SignedIn";

export default function Home() {
  const { user } = useInterfaceContext();

  return (
    <Layout>
      <Head>
        <title>Rx</title>
      </Head>

      {!user ? <SignedOut /> : <SignedIn user={user} />}

      {/*<Player />*/}
    </Layout>
  );
}
