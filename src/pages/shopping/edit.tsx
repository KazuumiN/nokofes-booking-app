import { ProductCard, BeerCard, MisonyuCard } from "../../components/shopping/ProductCard";
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { useRouter } from 'next/router';
import Select from 'react-select';
import Original from 'assets/original.jpg';
import Sour from 'assets/sour.jpg';
import Miso from 'assets/miso.jpg';
import Lactic from 'assets/lactic.jpg';
import { toast } from "react-toastify";
import Link from "next/link";
import clsx from "clsx";
import getShopItems from "lib/getShopItems";

const ShoppingForm = () => {
  const router = useRouter();
  const [originalCount, setOriginalCount] = useState(0);
  const [sourCount, setSourCount] = useState(0);
  const [misoCount, setMisoCount] = useState(0);
  const [lacticCount, setLacticCount] = useState(0);
  const [whenToBuy, setWhenToBuy] = useState(0);
  const [warnWhenToBuy, setWarnWhenToBuy] = useState(false);
  const { data, error } = useSWR('/api/edit/shopping');
  const ref = useRef(0);
  useEffect(() => {
    // 初期値設定
    if (!ref.current && data) {
      setOriginalCount(data.order.original);
      setSourCount(data.order.sour);
      setMisoCount(data.order.miso);
      setLacticCount(data.order.lactic);
      setWhenToBuy(data.order.whenToBuy);
      ref.current = 1;
    }
  }, [data]);
  useEffect(() => {
    // みそにゅーの予約時に13日の入場予約があるかをチェック
    if (!data?.order?.thirteenth && (misoCount || lacticCount)) {
      const toastWithLink = () => <div className="py-8"><Link href="/entrance/edit?reserve=misonyu"><a>みそにゅーの予約には、13日（日）の入場予約が必要です。<br />ここをタップして入場予約ページに移動できます。</a></Link></div>;
      toast.warn(toastWithLink, {
        autoClose: false,
        position: 'bottom-center',
        draggable: false,
        onOpen: () => {
          setMisoCount(0);
          setLacticCount(0);
        }
      });
    }
  }, [data?.order?.thirteenth, misoCount, lacticCount]);
  useEffect(() => {
    setWarnWhenToBuy(false);
  }, [whenToBuy]);
  
  if (error) return <p>Error: {error.message}<br/>お手数ですが、この画面をスクリーショットしてLINEまたはメールいただけるとスタッフが手動で対応いたします。</p>;
  if (!data) return <p>データを取得中...</p>;
  
  if  (data && !(data.order.eleventh || data.order.twelfth || data.order.thirteenth)) {
    // 予約していないため/editへ飛ばす。（本来は見えないはずの画面）
    router.push('/entrance/edit');
  }

  const shopItems = getShopItems()


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
    if (reserved) {
      router.push('/shopping');
    } else {
      router.push('/');
    }
  }
  const submit = () => {
    const whenToBuyData = whenToBuy ? whenToBuy : whenToBuy==null ? data.order.whenToBuy : 0;
    
    if (!checkIfAnythingChanged()) {
      if (reserved) {
        router.push('/shopping');
      } else {
        router.push('/');
      }
    }
    if (buyingMisonyu && !whenToBuyData) {
      setWarnWhenToBuy(true);
      toast.warn('受け取り日時を選択してください', {
        position: 'bottom-center',
        draggable: false,
        autoClose: 3000,
      });
      return
    }
    const id = toast.loading("送信中...", {
      position: 'bottom-center',
    })
    // api/edit/shoppingにPATCH
    fetch('/api/edit/shopping', {
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
        const text = reserved ? '予約を更新しました' : '予約を受け付けました'
        toast.update(id, {
          render: text,
          type: "success",
          isLoading: false,
          position: 'bottom-center',
          draggable: true,
          autoClose: 3000,
          closeOnClick: true,
        });
        if (originalCount || sourCount || misoCount || lacticCount) {
          router.push('/shopping?reserved=true');
        } else {
          router.push('/');
        }
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

  const options = data.times.map((time:any) => (
    { value: time.id, label:time.name, isDisabled: (!time.remaining && data.order.whenToBuy != time.id)}
  ))
  const noMisonyuTime = options.every((item:any)=> (item.isDisabled))

  const noBeerStock = !(data.stock.original || data.stock.sour)
  const noMisonyuStock = !(data.stock.miso || data.stock.lactic)
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 px-2">
        <div className="flex items-center">
          <Link href="/"><a><h1 className="text-xl font-bold border-b-2 border-transparent hover:border-black px-0.5 pb-0.5">トップ</h1></a></Link>
          <pre>{' > '}</pre>
          {reserved &&
            <>
              <Link href="/shopping"><a><h1 className="text-xl font-bold border-b-2 border-transparent hover:border-black px-0.5 pb-0.5">予約一覧</h1></a></Link>
              <pre>{' > '}</pre>
            </>
          }
          <h1 className="text-xl font-bold border-b-2 border-black px-0.5 pb-0.5 mr-auto">{reserved ? "予約の修正" : "商品の予約"}</h1>
        </div>
        {(noBeerStock && noMisonyuStock) &&
          <p>
            現在、在庫がありません。<br />当日のご来場をこころよりお待ちしております。
          </p>
        }
        <BeerCard
          counts={[originalCount, sourCount]}
          setCounts={[setOriginalCount, setSourCount]}
          buyAmountInitials={[data.order.original, data.order.sour]}
          images={[Original, Sour]}
          stocks={[data.stock.original, data.stock.sour]}
          {...shopItems.beerProducts}
        />
        {!noMisonyuTime ?
          <>
            <MisonyuCard
              counts={[misoCount, lacticCount]}
              setCounts={[setMisoCount, setLacticCount]}
              buyAmountInitials={[data.order.miso, data.order.lactic]}
              images={[Miso, Lactic]}
              stocks={[data.stock.miso, data.stock.lactic]}
              {...shopItems.misonyuProducts}
            />
            {buyingMisonyu && (
              <div className={clsx("flex flex-col items-start justify-between p-3", warnWhenToBuy && 'border-red-400 border-4 rounded-md')}>
                <dt className="text-xl font-semibold text-gray-900">受け取り日時</dt>
                <p>
                  {'味噌乳酸菌の受け取りは、受付可能な日時が限定されています。'}
                </p>
                <Select
                  className="self-end"
                  options={options}
                  defaultValue={data.order.whenToBuy ? options[data.order.whenToBuy-1] : null}
                  onChange={(e) => setWhenToBuy(e.value)}
                  isSearchable={false}
                />
              </div>
            )}
          </>
          :
          <MisonyuCard
            counts={[misoCount, lacticCount]}
            setCounts={[setMisoCount, setLacticCount]}
            buyAmountInitials={[data.order.miso, data.order.lactic]}
            images={[Miso, Lactic]}
            stocks={[0, 0]}
            {...shopItems.misonyuProducts}
          />
        }
      </div>
      {!(noBeerStock && noMisonyuStock) &&
        <section
          aria-labelledby="summary-heading"
          className="mt-8 rounded-lg bg-gray-50 px-4 py-6"
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
              disabled={(!reserved && (misoCount + lacticCount + originalCount + sourCount) == 0)}
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
      }

      <div className="mt-3 text-center text-sm">
        <button
          type="button"
          className="text-lg p-4 text-gray-600 hover:text-gray-500"
          onClick={cancel}
        >
          戻る
        </button>
      </div>
    </div>
  )
}

export default ShoppingForm