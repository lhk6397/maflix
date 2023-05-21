import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: (url) => fetch(url).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  );
}
