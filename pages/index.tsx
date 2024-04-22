import Layout from "../components/layout";
import Head from "next/head";
import React from "react";
import { useInterfaceContext } from "@/context/Interface";

import Disconnected from "@/components/index/Disconnected";
import Connected from "@/components/index/Connected";

export default function Home() {
  const { user } = useInterfaceContext();
  return (
    <Layout>
      <Head>
        <title>Rx</title>
      </Head>

      {!user ? <Disconnected /> : <Connected user={user} />}

      {/*<Player />*/}
    </Layout>
  );
}
