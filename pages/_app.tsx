import "../styles/globals.css";
import "styles/cmdk.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";
import { ThreadcrumbProvider } from "../contexts/Threadcrumbs";
import { CMDKProvider } from "../contexts/CMDK";
import { AlbumDetailsProvider } from "../contexts/CMDKAlbum";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Script
          src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
          async
        />
        <CMDKProvider>
          <AlbumDetailsProvider>
            <ThreadcrumbProvider>
              <Component {...pageProps} />
            </ThreadcrumbProvider>
          </AlbumDetailsProvider>
        </CMDKProvider>
        {/* <Toaster /> */}
        <ReactQueryDevtools />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
