import { ProductCard, BeerCard } from "../../components/shopping/ProductCard";
import { shoppingProps, productType } from "../../types"
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from 'next/router';
import Select from 'react-select';
import Beer from 'assets/beer.png';
import Miso from 'assets/miso.jpg';
import Lactic from 'assets/lactic.jpg';


// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const ShoppingForm = () => {
  const router = useRouter();
  const [originalCount, setOriginalCount] = useState(0);
  const [sourCount, setSourCount] = useState(0);
  const [misoCount, setMisoCount] = useState(0);
  const [lacticCount, setLacticCount] = useState(0);
  const [whenToBuy, setWhenToBuy] = useState(0);
  const { data, error } = useSWR('/api/shopping', fetcher);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>データを取得中...</p>;
  // TODO: dataの中身は標準で表示させるのみ。新しいstateも作る。

  const pricing = 900 * originalCount + 900 * sourCount + 500 * misoCount + 500 * lacticCount;

  const reserved = !!(data.order.original || data.order.sour || data.order.miso || data.order.lactic);
  
  const buyingMisonyu = !(misoCount==0 && lacticCount==0)
  
  const cancel = () => {
    // TODO: 記入済みのデータが消える警告モーダルを表示
    if (reserved) {
      router.push('/shopping');
    } else {
      router.push('/');
    }
  }
  const submit = () => {
    // TODO: まだ予約していないかつ来場日にチェックが入っていない場合、警告を表示して送信をさせない。
    const whenToBuyData = whenToBuy ? whenToBuy : whenToBuy==null ? data.order.whenToBuy : 0;
    if (buyingMisonyu && !whenToBuyData) {
      alert('受け取り日時を選択してください');
      return
    }
    // TODO: 送信処理
    // TODO: 帰ってきた値を使ってuseStateの値を更新（setUserDataみたいなやつ）
    // TODO: 完了したよToastを表示
    router.push('/shopping');
  }

  const options = data.times.map((time:any) => (
    { value: time.id, label:time.name, isDisabled: (time.remaining == 0 && data.order.whenToBuy != time.id)}
  ))
  
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold">{reserved ? "予約の修正" : "商品の予約"}</h1>
      <div className="flex flex-col space-y-8 px-2">
        <ProductCard
          counts={[originalCount, sourCount]}
          setCounts={[setOriginalCount, setSourCount]}
          buyAmountInitials={[data.order.original, data.order.sour]}
          image={Beer}
          stocks={[data.stock.original, data.stock.sour]}
          {...data.shopItems.beerProducts}
        />
        <div className="flex flex-col space-y-4 border-4 border-neutral-500 -m-2 p-2">
          <p className="self-end -mb-2">※日曜日のみ受け取り可能</p>
          <ProductCard
            counts={[misoCount]}
            setCounts={[setMisoCount]}
            buyAmountInitials={[data.order.miso]}
            image={Miso}
            stocks={[data.stock.miso]}
            {...data.shopItems.misoProduct}
          />
          <ProductCard
            counts={[lacticCount]}
            setCounts={[setLacticCount]}
            buyAmountInitials={[data.order.lactic]}
            image={Lactic}
            stocks={[data.stock.lactic]}
            {...data.shopItems.lacticProduct}
          />
          {buyingMisonyu && (
            <div className="flex flex-col items-start justify-between p-3">
              <dt className="text-xl font-semibold text-gray-900">受け取り日時</dt>
              <p>
                {'味噌乳酸菌の受け取りは、受付可能な日時が限定されています。'}
              </p>
              <Select
                className="self-end"
                options={options}
                defaultValue={data.order.whenToBuy ? options[data.order.whenToBuy-1] : null}
                isClearable={true}
                onChange={(e) => setWhenToBuy(e)}
                isSearchable={false}
              />
            </div>
          )}
        </div>
      </div>
      <section
        aria-labelledby="summary-heading"
        className="my-16 rounded-lg bg-gray-50 px-4 py-6"
      >
        <dl className="space-y-4">
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
            {reserved ? "予約を更新する" : "予約する"}
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