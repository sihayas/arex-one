import "../styles/globals.css";
import "styles/cmdk.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThreadcrumbProvider } from "@/context/Threadcrumbs";
import { SoundDetailsProvider } from "@/context/SoundContext";
import { Toaster } from "sonner";
import { InterfaceContextProvider } from "@/context/InterfaceContext";
import { NavProvider } from "@/context/NavContext";

const App = ({ Component, pageProps }: AppProps<{}>) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InterfaceContextProvider>
        <NavProvider>
          <SoundDetailsProvider>
            <ThreadcrumbProvider>
              <Component {...pageProps} />
            </ThreadcrumbProvider>
          </SoundDetailsProvider>
        </NavProvider>
      </InterfaceContextProvider>
      <Toaster />
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};

export default App;
