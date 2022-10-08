import { NextPage } from "next";
import type { Liff } from "@line/liff";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react"

const Layout: NextPage<{ liff: Liff | null; liffError: string | null; children: React.ReactNode }> = ({
  liff,
  liffError,
  children
}) => {
  const { data: session } = useSession()
  console.log(session)
  if (!session) {
    // 未ログイン
    if (liff?.isInClient()) {
      // liff.getAccessToken()を使ってcredentialsログイン
      // @ts-ignore
      liff.getAccessToken().then((accessToken) => {
        signIn("credentials", {
          accessToken,
          callbackUrl: `${window.location.origin}/`,
        });
      });
    } else {
      // メッセージを表示後googleログイン
      return (
        <div className="flex flex-col items-center text-center space-y-4">
          あなたは農工大生ですね。下のボタンを押して、農工大のGoogleアカウントを使ってログインしてください。
          <button className="border p-4 rounded-md" onClick={() => signIn('google')}>農工大Googleアカウントでログインする</button>
          もしあなたが農工大生でない場合は、農工祭公式LINEを追加して指示に従ってください。
          <p className="underline">農工祭公式LINE追加URL（建設中）</p>
        </div>
      )
    }
  }
  return (
    <>
      <main>{children}</main>
    </>
  )
}

export default Layout;