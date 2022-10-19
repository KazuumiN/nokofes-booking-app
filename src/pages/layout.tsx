import { NextPage } from "next";
import type { Liff } from "@line/liff";
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
  console.log('開発に興味があれば、何かご一緒できると嬉しいので西村(Twitter: @Kazuumi_N)にDMください！')
  if (status === "loading") {
    return <div className=" text-center">読み込み中...</div>
  }
  if (router.pathname === '/verify-request') {
    return (
      <main className="flex flex-col items-center max-w-sm mx-auto my-4 text-gray-900 sm:text-gray-700">
        {children}
      </main>
    )
  } else if (router.pathname === '/auth-error') {
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
      <main className="flex flex-col justify-end items-center pt-auto max-w-sm mx-auto text-gray-900 sm:text-gray-700">
        {children}
      </main>
    </>
  )
}

export default Layout;