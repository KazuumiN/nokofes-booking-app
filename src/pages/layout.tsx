import { NextPage } from "next";
import type { Liff } from "@line/liff";
import LiffContext from "store/LiffContext";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react"

const Layout: NextPage<{ children: React.ReactNode }> = ({
  children
}) => {
  const { data: session, status } = useSession()
  const liff = React.useContext(LiffContext);

  if (status === "loading") {
    return <div>Loading...</div>
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
      // メッセージを表示後googleログイン
      return (
        <div className="flex flex-col items-center text-center space-y-4">
          あなたは農工大生ですね。下のボタンを押して、農工大のGoogleアカウントを使ってログインしてください。
          <button className="border p-4 rounded-md" onClick={() => signIn('email')}>農工大Googleアカウントでログインする</button>
          もしあなたが農工大生でない場合は、農工祭公式LINEを追加して指示に従ってください。
          <p className="underline">農工祭公式LINE追加URL（建設中）</p>
        </div>
      )
    }
  }
  return (
    <>
      <main className="flex flex-col items-center max-w-sm mx-auto my-4 text-gray-900 sm:text-gray-700">
        {children}
      </main>
    </>
  )
}

export default Layout;