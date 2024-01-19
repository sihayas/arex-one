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
import localFont from "next/font/local";

const garamond12 = localFont({
  src: [
    {
      path: "../public/fonts/EBGaramond12-Regular.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/EBGaramond12-Italic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-garamond12",
});

const garamond08 = localFont({
  src: [
    {
      path: "../public/fonts/EBGaramond08-Regular.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/EBGaramond08-Italic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-garamond08",
});

const App = ({ Component, pageProps }: AppProps<{}>) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InterfaceContextProvider>
        <NavProvider>
          <SoundDetailsProvider>
            <ThreadcrumbProvider>
              <main className={`${garamond12.variable}`}>
                <Component {...pageProps} />
              </main>
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
