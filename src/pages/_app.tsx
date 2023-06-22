import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/calendar.css";
import "~/styles/globals.css";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider session={session}>
        <Head>
          <title>ToDoo</title>
          <meta name="description" content="Super Simple ToDo App" />
          <meta name="theme-color" content="#3b82f6" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <h1 className="pb-3 pt-3 text-center text-4xl font-bold">ToDoo</h1>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
