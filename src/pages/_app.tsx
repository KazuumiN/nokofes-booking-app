import 'react-toastify/dist/ReactToastify.css'
import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { Liff } from "@line/liff";
import { useState, useEffect, createContext, useContext } from "react";
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth'
import Layout from "./layout";
import LiffContext from "store/LiffContext";
import { SWRConfig } from 'swr'
import { ToastContainer } from 'react-toastify'
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);

  // liff.init()を実行するときにアプリが初期化される
  useEffect(() => {
    // ウィンドウが定義されていないエラーを回避する
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            setLiffObject(liff);
          })
          .catch((error: Error) => {
          });
      });
  }, []);
  

  return (
    <SessionProvider session={pageProps.session}>
      <LiffContext.Provider value={liffObject}>
        <SWRConfig value={{ fetcher: (url: string) => fetch(url).then((res) => res.json()) }}>
          <Layout>
            <div className="font-zenkaku">
              <ToastContainer />
              <Component {...pageProps} />
            </div>
          </Layout>
        </SWRConfig>
      </LiffContext.Provider>
    </SessionProvider>
  )
}

export default MyApp;
