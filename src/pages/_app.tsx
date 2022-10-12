import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { Liff } from "@line/liff";
import { useState, useEffect, createContext, useContext } from "react";
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth'
import Layout from "./layout";
import LiffContext from "store/LiffContext";
import Head from "next/head";
import Timer from "components/Timer";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const router = useRouter();

  // liff.init()を実行するときにアプリが初期化される
  useEffect(() => {
    // ウィンドウが定義されていないエラーを回避する
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);
  
  // TODO: 最終的にこれを反映する
  // if (new Date("2022-10-20T12:00:00+0900") > new Date()) {
  //   // 予約開始前はタイマーを表示する早期リターン
  //   return <><Head><title>予約開始までお待ちください！</title><link rel="icon" href="/favicon.ico" /></Head><Timer /></>
  // }
  return (
    <SessionProvider session={pageProps.session}>
      <LiffContext.Provider value={liffObject}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LiffContext.Provider>
    </SessionProvider>
  )
}

export default MyApp;
