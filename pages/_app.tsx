import "../styles/globals.css";
import "styles/cmdk.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  const [musicKitReady, setMusicKitReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
    script.async = true;
    script.onload = () => {
      window.MusicKit.configure({
        developerToken: process.env.NEXT_PUBLIC_MUSICKIT_TOKEN,
        app: {
          name: "Voir",
          build: "0001",
        },
      });
      setMusicKitReady(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!musicKitReady) {
    return <div>Loading MusicKit...</div>; // Or any other loading indicator
  }

  return (
    <QueryClientProvider client={queryClient}>
      <InterfaceContextProvider>
        <NavProvider>
          <SoundDetailsProvider>
            <main className={`${garamond12.variable} ${garamond08.variable}`}>
              <Component {...pageProps} />
            </main>
          </SoundDetailsProvider>
        </NavProvider>
      </InterfaceContextProvider>
      <Toaster />
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};

export default App;
