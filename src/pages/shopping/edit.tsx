import { MisonyuCard, BeerCard } from "../../components/shopping/ProductCard";
import { shoppingProps, productType } from "../../types"
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from 'next/router';
import Select from 'react-select';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const ShoppingForm = () => {
  const router = useRouter();
  const [originalCount, setOriginalCount] = useState(5);
  const [sourCount, setSourCount] = useState(4);
  const [misoCount, setMisoCount] = useState(0);
  const [lacticCount, setLacticCount] = useState(0);
  const { data, error } = useSWR('/api/shopping', fetcher);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;
  // TODO: dataの中身は標準で表示させるのみ。新しいstateも作る。

  const needWhenToBuy = true
  const pricing = 1100

  
  
  const cancel = () => {
    // TODO: 記入済みのデータが消える警告モーダルを表示
    if (data.reserved) {
      router.push('/shopping');
    } else {
      router.push('/');
    }
  }
  const submit = () => {
    // TODO: まだ予約していないかつ来場日にチェックが入っていない場合、警告を表示して送信をさせない。
    if (!data.reserved && true) {
      alert('来場日を選択してください。');
      return
    }
    // TODO: 送信処理
    // TODO: 帰ってきた値を使ってuseStateの値を更新（setUserDataみたいなやつ）
    // TODO: 完了したよToastを表示
    router.push('/entrance');
  }

  const options = data.shopItems.misonyuProducts.times.map((time:any) => (
    { value: time.id, label:time.name, isDisabled: (time.remaining == 0 && data.whenToBuy != time.id)}
  ))
  
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold">{data.reserved ? "予約の修正" : "商品の予約"}</h1>
      <div className="flex flex-col space-y-8 px-2">
        <BeerCard
          originalCount={originalCount}
          sourCount={sourCount}
          setOriginalCount={setOriginalCount}
          setSourCount={setSourCount}
          {...data.shopItems.beerProducts}
        />
        <MisonyuCard
          misoCount={misoCount}
          lacticCount={lacticCount}
          setMisoCount={setMisoCount}
          setLacticCount={setLacticCount}
          {...data.shopItems.misonyuProducts}
        />
      </div>
      <section
        aria-labelledby="summary-heading"
        className="my-16 rounded-lg bg-gray-50 px-4 py-6"
      >
        <dl className="space-y-4">
          {needWhenToBuy && (
            <div className="flex items-center justify-between">
              <dt className="text-xl font-semibold text-gray-900">受け取り日時</dt>
              <Select
                options={options}
                defaultValue={data.whenToBuy ? options[data.whenToBuy-1] : null}
                isClearable={true}
                onChange={(e) => console.log(e)}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <dt className="text-xl font-semibold text-gray-900">合計金額</dt>
            <dd className="text-xl font-medium text-gray-900">¥{pricing.toLocaleString()}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <button
            type="button"
            className="w-full rounded-md border border-transparent bg-green-600 py-3 px-4 text-xl font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            onClick={submit}
          >
            {data.reserved ? "予約を更新する" : "予約する"}
          </button>
        </div>
        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            className="text-lg text-green-600 hover:text-green-500"
            onClick={cancel}
          >
            戻る
          </button>
        </div>
      </section>
    </div>
  )
}

export default ShoppingForm