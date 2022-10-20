import { NextPage } from "next";
import Head from "next/head";
import dynamic from 'next/dynamic';
const Timer = dynamic(() => import("components/Timer"),{ssr:false})
import SignIn from "components/Signin";
import LiffContext from "store/LiffContext";
import { useRouter } from "next/router";
import { useContext, useEffect, ReactNode} from "react";
import { useSession, signIn, signOut } from "next-auth/react"

const Layout: NextPage<{ children: ReactNode }> = ({
  children
}) => {
  
  const { data: session, status } = useSession()
  const liff = useContext(LiffContext);
  const router = useRouter()
  useEffect(() => {
    console.log('開発に興味があれば、何かご一緒できると嬉しいので西村(Twitter: @Kazuumi_N)にDMください！')
  }, [])

  // 時刻判定はもう（10/20 16時前）には不要なので、コメントアウトしておく。
  // const expiryTimestamp = new Date("2022-10-20T12:00:00+0900")
  // if (expiryTimestamp > new Date()) {
  //   // 予約開始前はタイマーを表示する早期リターン
  //   return <><Head><title>予約開始までお待ちください！</title><link rel="icon" href="/favicon.ico" /></Head><Timer expiryTimestamp={expiryTimestamp} /></>
  // }

  // 読み込み中の際に不要なものを出さない。
  if (status === "loading") {
    return <div className=" text-center">読み込み中...</div>
  }

  if (router.pathname === '/verify-request') {
    // 認証メールを送りました画面
    return (
      <main className="flex flex-col items-center max-w-sm mx-auto my-4 text-gray-900 sm:text-gray-700">
        {children}
      </main>
    )
  } else if (router.pathname === '/auth-error') {
    // 認証エラー画面
    return (
      <main className="flex flex-col items-center max-w-sm mx-auto my-4 text-gray-900 sm:text-gray-700">
        {children}
      </main>
    )
  }

  if (!session) {
    // 未ログイン
    if (liff?.isInClient()) {
      // liff.getAccessToken()を使ってcredentialsログイン
      // @ts-ignore
      const accessToken = liff.getAccessToken()
      signIn("credentials", {
        accessToken,
        redirect: false,
      });
      return (
        <div>ログイン中...</div>
      )
    } else {
      // メッセージを表示後メールログイン
      return (
        <main className="flex flex-col justify-end items-center max-w-sm mx-auto my-4 text-gray-900 sm:text-gray-700">
          <SignIn /> 
        </main>
      )
    }
  }
  return (
    <>
      <Head>
        <title>農工祭予約システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-end items-center pt-auto max-w-sm mx-auto text-gray-900 sm:text-gray-700">
        {children}
      </main>
    </>
  )
}

export default Layout;