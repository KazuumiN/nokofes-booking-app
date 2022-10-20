
import { ProductPreviewCard } from "components/shopping/ProductCard"
import useSWR from "swr";
import { useRouter } from 'next/router';
import Link from 'next/link';
import getShopItems from "lib/getShopItems";
import Original from 'assets/original.jpg';
import Sour from 'assets/sour.jpg';
import Miso from 'assets/miso.jpg';
import Lactic from 'assets/lactic.jpg';

const convertWhenToBuy = (whenToBuy: number) => {
  switch (whenToBuy) {
    case 0:
      return '';
    case 1:
      return "11/13 10:00~12:00"
    case 2:
      return "11/13 12:00~14:00"
    case 3:
      return "11/13 14:00~16:00"
    
    default:
      return '';
  }
}


const ShoppingView = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api', { revalidateOnMount: true });
  if (error) return <p>Error: {error.message}<br/>お手数ですが、この画面をスクリーショットしてLINEまたはメールいただけるとスタッフが手動で対応いたします。</p>;
  if (!data) return <p>データを取得中...</p>;

  const reserved = router.query.reserved;
  const pricing = 900 * data.original + 900 * data.sour + 500 * data.miso + 500 * data.lactic;
  if (!pricing && !reserved) {
    // 料金=0なら予約していないため/editへ飛ばす
    router.push('/shopping/edit');
    return <p>予約ページに遷移します</p>
  }
  const shopItems = getShopItems()

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center self-start">
        <Link href="/"><a><h1 className="text-xl font-bold border-b-2 border-transparent hover:border-black px-0.5 pb-0.5">トップ</h1></a></Link>
        <pre>{' > '}</pre>
        <h1 className="text-xl font-bold border-b-2 border-black px-0.5 pb-0.5">予約一覧</h1>
      </div>
      {!!data.original && 
        <ProductPreviewCard image={Original} order={data.original} {...shopItems.beerProducts.items[0]} />
      }
      {!!data.sour &&
        <ProductPreviewCard image={Sour} order={data.sour} {...shopItems.beerProducts.items[1]} />
      }
      {!!data.miso &&
        <ProductPreviewCard image={Miso} order={data.miso} {...shopItems.misonyuProducts.items[0]} />
      }
      {!!data.lactic &&
        <ProductPreviewCard image={Lactic} order={data.lactic} {...shopItems.misonyuProducts.items[1]} />
      }
      <div className="w-full bg-neutral-200 p-3">
        <div className="flex justify-between mb-4 items-center">
          <p>受け取り日時</p>
          <p className="font-bold text-lg">{convertWhenToBuy(data.whenToBuy)}</p>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-xl font-semibold text-gray-900">合計金額</dt>
          <dd className="text-xl font-bold text-gray-900">¥{pricing.toLocaleString()}</dd>
        </div>
      </div>
      <Link href="/shopping/edit">
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
  )
}

export default ShoppingView