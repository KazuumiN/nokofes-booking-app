import Link from 'next/link';
import useSWR from "swr";
import { useRouter } from 'next/router';
import { entranceVisitType } from "lib/converters";

const EntranceView = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api/entrance', { revalidateOnMount: true });
  if (error) return <p>Error: {error.message}<br/>お手数ですが、この画面をスクリーショットしてLINEまたはメールいただけるとスタッフが手動で対応いたします。</p>;
  if (!data) return <p>データを取得中...</p>;

  const reserved = router.query.reserved;

  if (!(data.user.eleventh || data.user.twelfth || data.user.thirteenth) && !reserved) {
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
        <h1 className="text-3xl font-bold font-hina text-center my-2">ご来場日</h1>
        <h2 className='text-xl my-2'>&nbsp;&nbsp;今年度の学園祭の開催期間は<br/>11月11日〜11月13日の3日間です。</h2>
        <div className='text-xl'>
          {data.user.userType === 'nokodaisei' ?
          (
            <ul className="ml-2">
              <li className="mt-4 sm:col-span-2 sm:mt-0">
                11日 (金) : {entranceVisitType(data.user.eleventh)}
              </li>
              <li className="mt-4 sm:col-span-2 sm:mt-0">
                12日 (土) : {entranceVisitType(data.user.twelfth)}
              </li>
              <li className="mt-4 sm:col-span-2 sm:mt-0">
                13日 (日) : {entranceVisitType(data.user.thirteenth)}
              </li>
            </ul>
          ) : (
            <ul className="ml-8 list-disc">
              {data.user.eleventh ? (
                <li className="mt-4 sm:col-span-2 sm:mt-0">
                  11月11日（金）
                </li>
              ) : (<></>)}
              {data.user.twelfth ? (
                <li className="mt-4 sm:col-span-2 sm:mt-0">
                  11月12日（土）
                </li>
              ) : (<></>)}
              {data.user.thirteenth ? (
                <li className="mt-4 sm:col-span-2 sm:mt-0">
                  11月13日（日）
                </li>
              ) : (<></>)}
            </ul>
          )}
          {data.user.userType === 'general' && (
            <>
              <p className="mt-8 font-medium">
                同伴者数
              </p>
              <p className="mt-4 ml-8 sm:col-span-2 sm:mt-0">
                {data.user.accompaniers}名
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <Link href="/entrance/edit">
          <a className="w-full text-center rounded-md border border-transparent bg-gray-600 py-3 px-4 text-xl font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50">予約を修正する</a>
        </Link>
        <div className="mt-3 text-center text-sm">
          <Link href="/">
            <a className="text-lg p-4 text-gray-600 hover:text-gray-500">
              戻る
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EntranceView