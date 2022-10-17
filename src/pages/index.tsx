import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import Timer from "components/Timer";

const Home = () => {
  return (
    <div>
      <Head>
        <title>農工祭予約システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-2xl text-center p-4">
          不具合により、予約システムが上手く動いておりません。
          <br/>
          ご迷惑をおかけしております。
          <br />
          <br />
          現在最優先で作業中です。
          <br/>
          <br />
          <span className="font-bold">明日10/21の12:00より再開予定</span>
          <br/>
          です。今一度お待ちください。
        </div>
        {/* 作業タイムライン */}
        <div className="text-center">
          <Timer />
        </div>
      </main>
    </div>
  );
};

export default Home;
