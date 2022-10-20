import Link from 'next/link';
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from 'next/router';
import { entranceVisitType } from "lib/converters";
import Select from 'react-select';
import { toast } from "react-toastify";

const EntranceEdit = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api/edit/entrance');
  const [eleventh, setEleventh] = useState(null);
  const [twelfth, setTwelfth] = useState(null);
  const [thirteenth, setThirteenth] = useState(null);
  const [accompaniers, setAccompaniers] = useState(null);
  if (error) return <p>Error: {error.message}<br/>お手数ですが、この画面をスクリーショットしてLINEまたはメールいただけるとスタッフが手動で対応いたします。</p>;
  if (!data) return <p>データを取得中...</p>;
  
  const reserveMisonyu = router.query.reserve === 'misonyu';

  const reserved = !!(data.user.eleventh || data.user.twelfth || data.user.thirteenth);

  // @ts-ignore
  const eleventhData = eleventh == true ? 1 : eleventh == false ? 0 : eleventh ? eleventh.value : reserved ? data.user.eleventh : 0;
  // @ts-ignore
  const twelfthData = twelfth == true ? 1 : twelfth == false ? 0 : twelfth ? twelfth.value : reserved ? data.user.twelfth : 0;
  // @ts-ignore
  const thirteenthData = thirteenth == true ? 1 : thirteenth == false ? 0 : thirteenth ? thirteenth.value : reserved ? data.user.thirteenth : 0;
  // @ts-ignore
  const accompaniersData = data.user.userType === 'nokodaisei' ? 0 : accompaniers ? accompaniers.value : reserved ? data.user.accompaniers : 0;

  const accompaniersOptions = [0,1,2,3,4].map((i) => (
    { value: i, label: i, isDisabled: ((eleventhData && (data.stock.eleventh < i+1))||(twelfthData && (data.stock.twelfth < i+1))||(thirteenthData && (data.stock.thirteenth < i+1))) }
  ))

  const optionsEleventh = [0,1,2].map((i) => (
    { value: i, label: entranceVisitType(i), isDisabled: (i==1 && data.stock.eleventh < 1)}
  ))
  const optionsTwelfth = [0,1,2].map((i) => (
    { value: i, label: entranceVisitType(i), isDisabled: (i==1 && data.stock.twelfth < 1)}
  ))
  const optionsThirteenth = [0,1,2].map((i) => (
    { value: i, label: entranceVisitType(i), isDisabled: (i==1 && data.stock.thirteenth < 1)}
  ))

  const cancel = () => {
    if (reserved) {
      router.push('/entrance');
    } else {
      router.push('/');
    }
  }
  const submit = () => {
    // 注文をしている人は予約を取り消せない
    if ((data.user.original || data.user.sour || data.user.miso || data.user.lactic) && !(eleventhData || twelfthData || thirteenthData)) {
      const toastWithLink = () => <div className="py-8"><Link href="/shopping/edit"><a>物品を予約されている方は入場を取り消せません。<br />ここをタップして物品予約ページに移動できます。</a></Link></div>;
      toast.warn(toastWithLink, {
        autoClose: false,
        position: 'bottom-center',
        draggable: false,
      });
      return;
    }
    // 味噌乳酸菌を注文している人は予約を取り消せない
    if ((data.user.miso || data.user.lactic) && !thirteenthData) {
      const toastWithLink = () => <div className="py-8"><Link href="/shopping/edit"><a>味噌乳酸菌を注文している人は13日の予約を取り消せません<br />ここをタップして物品予約ページに移動できます。</a></Link></div>;
      toast.warn(toastWithLink, {
        autoClose: false,
        position: 'bottom-center',
        draggable: false,
      });
      return;
    }

    const id = toast.loading("送信中...", {
      position: 'bottom-center',
    })
    // api/edit/entranceにPATCH
    fetch('/api/edit/entrance', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eleventh: eleventhData,
        twelfth: twelfthData,
        thirteenth: thirteenthData,
        accompaniers: accompaniersData
      })
    }).then((res) => {
      if (res.status === 200) {
        // 値が問題ないことを完了したことを確認してからToastを表示する
        if (reserveMisonyu && thirteenthData) {
          toast.update(id, {
            render: '13日の予約が完了しました。物品予約ページへ戻ります。',
            type: "info",
            isLoading: false,
            position: 'bottom-center',
            draggable: true,
            autoClose: 5000
          });
          setTimeout(() => {
            router.push('/shopping/edit');
          }, 1000);
          return;
        }
        if (reserved) {
          toast.update(id, {
            render: '予約を更新しました',
            type: "success",
            isLoading: false,
            position: 'bottom-center',
            draggable: true,
            autoClose: 3000,
            closeOnClick: true,
          });
        } else {
          const toastWithLink = () => <div className="py-4"><Link href="/shopping/edit"><a>入場予約を受け付けました<br />ここをタップして物品予約ページに移動できます。</a></Link></div>;
          toast.update(id, {
            render: toastWithLink,
            type: "success",
            isLoading: false,
            position: 'bottom-center',
            draggable: true,
            autoClose: 5000,
            closeOnClick: true,
          });
        }

        router.push('/entrance?reserved=true');
      } else {
        toast.update(id, {
          render: 'エラーが発生しました。在庫数が変わった可能性があるため再読み込みしました。',
          type: 'error',
          isLoading: false,
          position: 'bottom-center',
          draggable: true,
          autoClose: 5000
        })
        router.reload();
      }
    });
  }
  return (
    <div className="w-full px-4 h-screen ">
      <div className="flex items-center">
        <Link href="/"><a><h1 className="text-xl font-bold border-b-2 border-transparent hover:border-black px-0.5 pb-0.5">トップ</h1></a></Link>
        <pre>{' > '}</pre>
        {reserved &&
          <>
            <Link href="/entrance"><a><h1 className="text-xl font-bold border-b-2 border-transparent hover:border-black px-0.5 pb-0.5">来場確認</h1></a></Link>
            <pre>{' > '}</pre>
          </>
        }
        <h1 className="text-xl font-bold border-b-2 border-black px-0.5 pb-0.5 mr-auto">{reserved ? "予約の修正" : "来場の予約"}</h1>
      </div>
      <div className="m-4"><h1 className="text-3xl font-bold font-hina text-center my-2">ご来場お申し込み</h1>
        <h2 className='text-xl my-2'>&nbsp;&nbsp;今年度の学園祭の開催期間は<br/>11月11日〜11月13日の3日間です。</h2>
        {reserved && data.user.userType === 'general' && (
          <p>
            お申し込みを取り消されたい場合は、チェックを外して送信してください。
          </p>
        )}
        <div className="text-xl mt-4 sm:col-span-2 sm:mt-0">

          {data.user.userType === 'nokodaisei' ? (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-lg">
                  11日
                </p>
                <Select
                  options={optionsEleventh}
                  defaultValue={reserved ? optionsEleventh[data.user.eleventh] : optionsEleventh[0]}
                  onChange={(e) => {
                    // @ts-ignore
                    return setEleventh(e)
                  }}
                  isSearchable={false}
                />
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <p className="text-lg">
                  12日
                </p>
                <Select
                  options={optionsTwelfth}
                  defaultValue={reserved ? optionsTwelfth[data.user.twelfth] : optionsTwelfth[0]}
                  onChange={(e) => {
                    // @ts-ignore
                    return setTwelfth(e)
                  }}
                  isSearchable={false}
                />
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <p className="text-lg">
                  13日
                </p>
                <Select
                  options={optionsThirteenth}
                  defaultValue={reserved ? optionsThirteenth[data.user.thirteenth] : optionsThirteenth[0]}
                  onChange={(e) => {
                    // @ts-ignore
                    return setThirteenth(e)}
                  }
                  isSearchable={false}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-lg space-y-4">
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="eleventh"
                    name="eleventh"
                    type="checkbox"
                    checked={eleventh != null ? eleventh : reserved ? data.user.eleventh : false}
                    disabled={data.stock.eleventh < accompaniersData + 1}
                    onChange={(e) => {
                      // @ts-ignore
                      return setEleventh(e.target.checked)}
                    }
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="eleventh" className="font-medium text-gray-700">
                    11月11日（金）
                  </label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="twelfth"
                    name="twelfth"
                    type="checkbox"
                    checked={twelfth != null ? twelfth : reserved ? data.user.twelfth : false}
                    disabled={data.stock.twelfth < accompaniersData + 1}
                    onChange={(e) => {
                      // @ts-ignore
                      return setTwelfth(e.target.checked)}
                    }
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="twelfth" className="font-medium text-gray-700">
                    11月12日（土）
                  </label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="thirteenth"
                    name="thirteenth"
                    type="checkbox"
                    checked={thirteenth != null ? thirteenth : reserved ? data.user.thirteenth : false}
                    disabled={data.stock.thirteenth < accompaniersData + 1}
                    onChange={(e) => {
                      // @ts-ignore
                      return setThirteenth(e.target.checked)}
                    }
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="thirteenth" className="font-medium text-gray-700">
                    11月13日（日）
                  </label>
                  <p className="text-gray-500"></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {data.user.userType === 'general' && (
        <div className="m-4">
          <label htmlFor="accompaniers" className="text-lg font-medium ">
            同伴者数
          </label>
          <p className='text-sm'>&nbsp;&nbsp;基本的はお一人お一人でのお申し込みをお願いいたしております。<br />&nbsp;&nbsp;小学生以下のお子様など、スマホを持っておられない同伴者がいらっしゃる場合は同伴者数をご記入ください。</p>
          <Select
            options={accompaniersOptions}
            defaultValue={reserved ? accompaniersOptions[data.user.accompaniers] : accompaniersOptions[0]}
            onChange={(e) => {
              // @ts-ignore
              return setAccompaniers(e)}
            }
          />
        </div>
      )}
      <div className="pt-5 mt-auto">
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg px-4 py-6"
        >
          <div className="mt-6">
            <button
              type="button"
              className="w-full rounded-md border border-transparent disabled:bg-gray-600 bg-green-600 py-3 px-4 text-xl font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              onClick={submit}
              disabled={(!reserved && !(eleventh || twelfth || thirteenth))}
            >
              {reserved ? "予約を更新する" : "予約する"}
            </button>
          </div>
          <div className="mt-3 text-center text-sm">
            <button
              type="button"
              className="text-lg p-4 text-green-600 hover:text-green-500"
              onClick={cancel}
            >
              キャンセルして戻る
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}


export default EntranceEdit
