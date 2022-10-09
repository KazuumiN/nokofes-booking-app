import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import Timer from "components/Timer";

const Home: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
  liffError
}) => {
  if (new Date("2022-10-20T12:00:00+0900") > new Date()) {
    // 予約開始前はタイマーを表示する早期リターン
    return <><Head><title>予約開始までお待ちください！</title><link rel="icon" href="/favicon.ico" /></Head><Timer /></>
  }
  // 予約開始後

  return (
    <div>
      <Head>
        <title>農工祭予約システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-2xl text-center">予約開始！</div>
      </main>
    </div>
  );
};

export default Home;
