// TODO: 選択不可能な項目を非表示にする
import { entranceProps } from "../../types"
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from 'next/router';
import { entranceVisitType } from "lib/converters";
import Select from 'react-select';
import { toast } from "react-toastify";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const EntranceEdit = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api/entrance', fetcher);
  const [eleventh, setEleventh] = useState(null);
  const [twelfth, setTwelfth] = useState(null);
  const [thirteenth, setThirteenth] = useState(null);
  const [accompaniers, setAccompaniers] = useState(null);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>データを取得中...</p>;

  const reserved = !!(data.eleventh || data.twelfth || data.thirteenth);

  const options = [0,1,2].map((i) => (
    { value: i, label: entranceVisitType(i) }
  ))
  
  const accompaniersOptions = [0,1,2,3,4].map((i) => (
    { value: i, label: i }
  ))

  const cancel = () => {
    // TODO: 記入済みのデータが消える警告モーダルを表示
    if (reserved) {
      router.push('/entrance');
    } else {
      router.push('/');
    }
  }
  const submit = () => {    
    // TODO: 送信処理
    // TODO: 完了したよToastを表示
    // @ts-ignore
    const eleventhData = eleventh ? eleventh.value : reserved ? data.eleventh : 0;
    // @ts-ignore
    const twelfthData = twelfth ? twelfth.value : reserved ? data.twelfth : 0;
    // @ts-ignore
    const thirteenthData = thirteenth ? thirteenth.value : reserved ? data.thirteenth : 0;
    // @ts-ignore
    const accompaniersData = data.userType === 'nokodaisei' ? 0 : accompaniers ? accompaniers.value : reserved ? data.accompaniers : 0;
    console.log(data)
    // 注文をしている人は予約を取り消せない
    if ((data.original || data.sour || data.miso || data.lactic) && !(eleventhData || twelfthData || thirteenthData)) {
      alert('注文をしている人は予約を取り消せません');
      return;
    }
    // 味噌乳酸菌を注文している人は予約を取り消せない
    if ((data.miso || data.lactic) && !thirteenthData) {
      alert('味噌乳酸菌を注文している人は13日の予約を取り消せません');
      return;
    }


    // api/entranceにPATCH
    fetch('/api/entrance', {
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
        toast.success(`${reserved ? '予約を更新しました' : '予約を受け付けました'}`, {
          position: 'bottom-center',
          draggable: true,
        });

        router.push('/entrance');
      } else {
        alert('エラーが発生しました。');
      }
    });
  }
  return (
    <div className="w-full px-4">
      <div className="m-4">
        <div className="text-lg font-medium">
          ご来場日
        </div>
        {reserved && data.userType === 'general' && (
          <p>
            お申し込みを取り消されたい場合は、チェックを外して送信してください。
          </p>
        )}
        <div className="mt-4 sm:col-span-2 sm:mt-0">

          {data.userType === 'nokodaisei' ? (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-lg">
                  11日
                </p>
                <Select
                  options={options}
                  defaultValue={reserved ? options[data.eleventh] : options[0]}
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
                  options={options}
                  defaultValue={reserved ? options[data.twelfth] : options[0]}
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
                  options={options}
                  defaultValue={reserved ? options[data.thirteenth] : options[0]}
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
                    checked={eleventh != null ? eleventh : reserved ? data.eleventh : false}
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
                    checked={twelfth != null ? twelfth : reserved ? data.twelfth : false}
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
                    checked={thirteenth != null ? thirteenth : reserved ? data.thirteenth : false}
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
      {data.userType === 'general' && (
        <div className="m-4">
          <label htmlFor="accompaniers" className="text-lg font-medium ">
            同伴者数
          </label>
          <Select
            options={accompaniersOptions}
            defaultValue={reserved ? accompaniersOptions[data.accompaniers] : options[0]}
            onChange={(e) => {
              // @ts-ignore
              return setAccompaniers(e)}
            }
          />
        </div>
      )}
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={cancel}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={submit}
          >
            {reserved ? '更新' : '予約'}する
          </button>
        </div>
      </div>
    </div>
  )
}


export default EntranceEdit
