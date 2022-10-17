// TODO: 入場予約が行われてない場合入場予約ページに飛ばす案内と処理
// TODO: みそにゅうを予約しようとした人が日曜日の入場予約を行っていない場合、入場予約ページに飛ばす。
// TODO: 在庫がない時はその予約項目を隠す&みそにゅうは人数制限に達した時に隠す&&人数制限の項目は都度隠していく

import { ProductCard, BeerCard, MisonyuCard } from "../../components/shopping/ProductCard";
import { shoppingProps, productType } from "../../types"
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { useRouter } from 'next/router';
import Select from 'react-select';
import Beer from 'assets/beer.png';
import Original from 'assets/original.jpg';
import Sour from 'assets/sour.jpg';
import Miso from 'assets/miso.jpg';
import Lactic from 'assets/lactic.jpg';
import { toast } from "react-toastify";


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
  const ref = useRef(0);
  useEffect(() => {
    if (!ref.current && data) {
      setOriginalCount(data.order.original);
      setSourCount(data.order.sour);
      setMisoCount(data.order.miso);
      setLacticCount(data.order.lactic);
      setWhenToBuy(data.order.whenToBuy);
      ref.current = 1;
    }
  }, [data]);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>データを取得中...</p>;


  const pricing = 900 * originalCount + 900 * sourCount + 500 * misoCount + 500 * lacticCount;

  const reserved = !!(data.order.original || data.order.sour || data.order.miso || data.order.lactic);
  
  const buyingMisonyu = !(misoCount==0 && lacticCount==0)

  const checkIfAnythingChanged = () => {
    if (originalCount == data.order.original && sourCount == data.order.sour && misoCount == data.order.miso && lacticCount == data.order.lactic && whenToBuy == data.order.whenToBuy) {
      return false;
    }
    return true;
  }
  
  const cancel = () => {
    // TODO: 記入済みのデータが消える警告モーダルを表示
    if (reserved) {
      router.push('/shopping');
    } else {
      router.push('/');
    }
  }
  const submit = () => {
    console.log('submit');
    console.log(originalCount);
    console.log(sourCount);
    console.log(misoCount);
    console.log(lacticCount);
    console.log(whenToBuy);
    // TODO: まだ予約していないかつ来場日にチェックが入っていない場合、警告を表示して送信をさせない。
    const whenToBuyData = whenToBuy ? whenToBuy : whenToBuy==null ? data.order.whenToBuy : 0;

    if (!checkIfAnythingChanged()) {
      if (reserved) {
        router.push('/shopping');
      } else {
        router.push('/');
      }
    }
    
    if (buyingMisonyu && !whenToBuyData) {
      alert('受け取り日時を選択してください');
      return
    }
    // api/shoppingにPATCH
    fetch('/api/shopping', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        original: originalCount,
        sour: sourCount,
        miso: misoCount,
        lactic: lacticCount,
        whenToBuy: whenToBuyData
      })
    }).then((res) => {
      if (res.status === 200) {
        // 値が問題ないことを完了したことを確認してからToastを表示する
        toast.success(`${reserved ? '予約を更新しました' : '予約を受け付けました'}`, {
          position: 'bottom-center',
          draggable: true,
        });

        router.push('/shopping');
      } else {
        alert('エラーが発生しました。');
      }
    });
  }

  const options = data.times.map((time:any) => (
    { value: time.id, label:time.name, isDisabled: (time.remaining == 0 && data.order.whenToBuy != time.id)}
  ))
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 px-2">
        <h1 className="text-xl font-bold border-b-2 border-black px-0.5 pb-0.5 mr-auto">{reserved ? "予約の修正" : "商品の予約"}</h1>
        <BeerCard
          counts={[originalCount, sourCount]}
          setCounts={[setOriginalCount, setSourCount]}
          buyAmountInitials={[data.order.original, data.order.sour]}
          images={[Original, Sour]}
          stocks={[data.stock.original, data.stock.sour]}
          {...data.shopItems.beerProducts}
        />
        <MisonyuCard
          counts={[misoCount, lacticCount]}
          setCounts={[setMisoCount, setLacticCount]}
          buyAmountInitials={[data.order.miso, data.order.lactic]}
          images={[Miso, Lactic]}
          stocks={[data.stock.miso, data.stock.lactic]}
          {...data.shopItems.misonyuProducts}
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
        {/* 
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
        </div>
         */}
      </div>
      <section
        aria-labelledby="summary-heading"
        className="mt-16 rounded-lg bg-gray-50 px-4 py-6"
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
        <div className="mt-3 text-center text-sm">
          <button
            type="button"
            className="text-lg p-4 text-green-600 hover:text-green-500"
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