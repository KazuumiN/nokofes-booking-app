// TODO: おしゃれにしたい
import { useState } from 'react';
import Link from 'next/link';
import useSWR from "swr";
import { useRouter } from 'next/router';
import { entranceVisitType } from "lib/converters";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const EntranceView = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api/entrance', fetcher, { revalidateOnMount: true });
  if (error) return <p>Error: {error.message}<br/>お手数ですが、この画面をスクリーショットしてLINEまたはメールいただけるとスタッフが手動で対応いたします。</p>;
  if (!data) return <p>データを取得中...</p>;

  const reserved = router.query.reserved;

  if (!(data.eleventh || data.twelfth || data.thirteenth) && !reserved) {
    // 予約していないため/editへ飛ばす
    router.push('/entrance/edit');
    return <p>予約ページに遷移します...</p>;
  }
  return (
    <div className="w-full p-8 h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center self-start">
          <Link href="/"><a><h1 className="text-xl font-bold border-b-2 border-transparent hover:border-black px-0.5 pb-0.5">トップ</h1></a></Link>
          <pre>{' > '}</pre>
          <h1 className="text-xl font-bold border-b-2 border-black px-0.5 pb-0.5">ご来場日</h1>
        </div>
        {data.userType === 'nokodaisei' ?
        (
          <ul className="ml-2">
            <li className="mt-4 sm:col-span-2 sm:mt-0">
              11月11日（金） : {entranceVisitType(data.eleventh)}
            </li>
            <li className="mt-4 sm:col-span-2 sm:mt-0">
              11月12日（土） : {entranceVisitType(data.twelfth)}
            </li>
            <li className="mt-4 sm:col-span-2 sm:mt-0">
              11月13日（日） : {entranceVisitType(data.thirteenth)}
            </li>
          </ul>
        ) : (
          <ul className="ml-8 list-disc">
            {data.eleventh ? (
              <li className="mt-4 sm:col-span-2 sm:mt-0">
                11月11日（金）
              </li>
            ) : (<></>)}
            {data.twelfth ? (
              <li className="mt-4 sm:col-span-2 sm:mt-0">
                11月12日（土）
              </li>
            ) : (<></>)}
            {data.thirteenth ? (
              <li className="mt-4 sm:col-span-2 sm:mt-0">
                11月13日（日）
              </li>
            ) : (<></>)}
          </ul>
        )}
        {data.userType === 'general' && (
          <>
            <p className="mt-8 text-base font-medium sm:text-sm">
              同伴者数
            </p>
            <p className="mt-4 ml-8 sm:col-span-2 sm:mt-0">
              {data.accompaniers}名
            </p>
          </>
        )}
      </div>
      <div className="flex justify-between">
        <Link href="/">
          <a
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            トップに戻る
          </a>
        </Link>
        <Link href="/entrance/edit">
          <a
            className="rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
            修正する
          </a>
        </Link>
      </div>
    </div>
  )
}

export default EntranceView