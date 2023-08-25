import "../styles/globals.css";
import "styles/cmdk.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThreadcrumbProvider } from "../context/Threadcrumbs";
import { AlbumDetailsProvider } from "../context/CMDKAlbum";
import { Toaster } from "sonner";
import { CMDKProvider } from "../context/CMDKContext";
import CustomCursor from "@/components/global/CustomCursor";
import { ScrollProvider } from "@/context/ScrollContext";

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Script
          src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
          async
        />
        <ScrollProvider>
          <CMDKProvider>
            <AlbumDetailsProvider>
              <ThreadcrumbProvider>
                {/* <CustomCursor /> */}
                <Component {...pageProps} />
              </ThreadcrumbProvider>
            </AlbumDetailsProvider>
          </CMDKProvider>
        </ScrollProvider>
        <Toaster />
        {/* <ReactQueryDevtools /> */}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
