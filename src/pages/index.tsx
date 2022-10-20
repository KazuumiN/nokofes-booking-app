// TODO: 申し込みの受付が終了した時、その旨のメッセージを表示する。
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dynamic from 'next/dynamic';
const NumberAndQR = dynamic(() => import('components/NumberAndQR'),{ssr:false})
import useSWR from "swr";

const Home: NextPage = () => {
  const { data, error } = useSWR('/api');
  if (error) return <p>Error: {error.message}<br/>お手数ですが、この画面をスクリーショットしてLINEまたはメールいただけるとスタッフが手動で対応いたします。</p>;
  if (!data) return <p>データを取得中...</p>;
  const entranceReserved = !!(data.eleventh || data.twelfth || data.thirteenth)
  const shoppingReserved = !!(data.original || data.sour || data.miso || data.lactic)

  // 予約開始後
  return (
    <div className="flex flex-col justify-around h-screen text-center">
      <h1 className="text-3xl font-bold font-hina mt-4">農工祭予約システム</h1>
      {entranceReserved && (
        <NumberAndQR numberId={data.numberId} longerId={data.longerId} />
      )}

      <div>
        <div className="flex justify-between px-3 space-x-2">
          <Link href={entranceReserved ? "/entrance" : "/entrance/edit"} >
            <a className="bg-green-500 hover:bg-green-700 text-white text-2xl font-bold py-4 px-8 rounded whitespace-pre-wrap"
            >
              {entranceReserved ? "入場予約\n確認修正" : "入場予約\n申し込み"}
            </a>
          </Link>
          {entranceReserved ? (
            <Link href={shoppingReserved ? "/shopping" : "/shopping/edit"} >
            <a className="bg-green-500 hover:bg-green-700 text-white text-2xl font-bold py-4 px-8 rounded whitespace-pre-wrap"
            >
              {shoppingReserved ? "販売予約\n確認修正" : "販売予約\n申し込み"}
            </a>
          </Link>
          ) : (
            <p className="bg-gray-500 text-white text-2xl font-bold py-4 px-8 rounded whitespace-pre-wrap"
            >
              {shoppingReserved ? "販売予約\n確認修正" : "販売予約\n申し込み"}
            </p>
          )}
        </div>
        {!entranceReserved && (
          <p className="text-left ml-3 mt-3 text-2xl">まずは<br/><span className="font-black">入場予約</span>を行ってください！</p>
        )}
      </div>
    </div>
  );
};

export default Home;

