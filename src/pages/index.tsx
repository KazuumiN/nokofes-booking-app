import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import dynamic from 'next/dynamic';
const NumberAndQR = dynamic(() => import('components/NumberAndQR'),{ssr:false})
import useSWR from "swr";
// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const Home: NextPage = () => {
  const { data, error } = useSWR('/api', fetcher);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  const {
    numberId,
    longerId,
    userType,
    entranceReserved,
    shoppingReserved,
  } = data
  
  // 予約開始後
  return (
    <>
      <Head>
        <title>農工祭予約システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {entranceReserved && (
        <NumberAndQR numberId={numberId} longerId={longerId} />
      )}

      <div className="flex justify-between space-x-2">
        <Link href={entranceReserved ? "/entrance" : "/entrance/edit"} >
          <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
          >
            {entranceReserved ? "入場予約\n確認修正" : "入場予約\n申し込み"}
          </a>
        </Link>
        {entranceReserved ? (
          <Link href={shoppingReserved ? "/shopping" : "/shopping/edit"} >
          <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
          >
            {shoppingReserved ? "販売予約\n確認修正" : "販売予約\n申し込み"}
          </a>
        </Link>
        ) : (
          <p className="bg-gray-500 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
          >
            {shoppingReserved ? "販売予約\n確認修正" : "販売予約\n申し込み"}
          </p>
        )}
      </div>
    </>
  );
};

export default Home;

