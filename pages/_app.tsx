import "../styles/globals.css";
import "styles/cmdk.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThreadcrumbProvider } from "@/context/Threadcrumbs";
import { SoundDetailsProvider } from "@/context/SoundContext";
import { Toaster } from "sonner";
import { InterfaceContextProvider } from "@/context/InterfaceContext";
import { InputProvider } from "@/context/InputContext";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

const App = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <InterfaceContextProvider>
          <InputProvider>
            <SoundDetailsProvider>
              <ThreadcrumbProvider>
                <Component {...pageProps} />
              </ThreadcrumbProvider>
            </SoundDetailsProvider>
          </InputProvider>
        </InterfaceContextProvider>
        <Toaster />
        {/* <ReactQueryDevtools /> */}
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
