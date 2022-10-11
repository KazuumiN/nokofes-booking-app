import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
const NumberAndQR = dynamic(() => import('components/NumberAndQR'),{ssr:false})

const Home: NextPage = () => {
  const { data: session } = useSession();

  const entranceReserved = true
  const shoppingReserved = false

  // 予約開始後
  return (
    <>
      <Head>
        <title>農工祭予約システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session?.user?.idNumber && (entranceReserved || shoppingReserved) && (
        <NumberAndQR id={session?.user?.idNumber} />
      )}
      <div className="flex justify-between space-x-2">
        <Link href={'/entrance'} >
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
          >
            {entranceReserved ? "入場予約\n確認修正" : "入場予約\n申し込み"}
          </a>
        </Link>
        <Link href={'/shopping'} >
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
          >
            {shoppingReserved ? "販売予約\n確認修正" : "販売予約\n申し込み"}
          </a>
        </Link>
      </div>
    </>
  );
};

export default Home;
