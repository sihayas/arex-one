import "../styles/globals.css";
import "styles/cmdk.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThreadcrumbProvider } from "../context/Threadcrumbs";
import { SoundDetailsProvider } from "../context/Sound";
import { Toaster } from "sonner";
import { InterfaceContextProvider } from "../context/InterfaceContext";

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <InterfaceContextProvider>
          <SoundDetailsProvider>
            <ThreadcrumbProvider>
              <Component {...pageProps} />
            </ThreadcrumbProvider>
          </SoundDetailsProvider>
        </InterfaceContextProvider>
        <Toaster />
        {/* <ReactQueryDevtools /> */}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
