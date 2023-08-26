import "../styles/globals.css";
import "styles/cmdk.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThreadcrumbProvider } from "../context/Threadcrumbs";
import { AlbumDetailsProvider } from "../context/Sound";
import { Toaster } from "sonner";
import { InterfaceProvider } from "../context/Interface";
import Cursor from "@/components/global/Cursor";

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Script
          src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
          async
        />
        <InterfaceProvider>
          <AlbumDetailsProvider>
            <ThreadcrumbProvider>
              <Cursor />
              <Component {...pageProps} />
            </ThreadcrumbProvider>
          </AlbumDetailsProvider>
        </InterfaceProvider>
        <Toaster />
        {/* <ReactQueryDevtools /> */}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
