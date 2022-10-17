
// @ts-nocheck
import { ProductPreviewCard } from "components/shopping/ProductCard"
import useSWR from "swr";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Original from 'assets/original.jpg';
import Sour from 'assets/sour.jpg';
import Miso from 'assets/miso.jpg';
import Lactic from 'assets/lactic.jpg';
// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())


const ShoppingView = () => {
  const router = useRouter();
  const { data, error } = useSWR('/api/shopping', fetcher);
  if (error) return <p>Error: {error.message}<br/>お手数ですが、この画面をスクリーショットしてLINEまたはメールいただけるとスタッフが手動で対応いたします。</p>;
  if (!data) return <p>データを取得中...</p>;

  const reserved = router.query.reserved;
  const pricing = 900 * data.order.original + 900 * data.order.sour + 500 * data.order.miso + 500 * data.order.lactic;
  if (!pricing && !reserved) {
    // 料金=0なら予約していないため/editへ飛ばす
    router.push('/shopping/edit');
    return <p>予約ページに遷移します</p>
  }
  // TODO: 味噌の横幅が広がりすぎてるのを対応したい。

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-xl font-bold border-b-2 border-black px-0.5 pb-0.5 mr-auto">予約の確認</h1>
      {!!data.order.original && 
        <ProductPreviewCard image={Original} order={data.order.original} {...data.shopItems.beerProducts.items[0]} />
      }
      {!!data.order.sour &&
        <ProductPreviewCard image={Sour} order={data.order.sour} {...data.shopItems.beerProducts.items[1]} />
      }
      {!!data.order.miso &&
        <ProductPreviewCard image={Miso} order={data.order.miso} {...data.shopItems.misonyuProducts.items[0]} />
      }
      {!!data.order.lactic &&
        <ProductPreviewCard image={Lactic} order={data.order.lactic} {...data.shopItems.misonyuProducts.items[1]} />
      }
      <div className="w-full bg-neutral-200 p-3">
        <div className="flex items-center justify-between">
          <dt className="text-xl font-semibold text-gray-900">合計金額</dt>
          <dd className="text-xl font-medium text-gray-900">¥{pricing.toLocaleString()}</dd>
        </div>
      </div>
      <Link href="/shopping/edit">
        <a className="w-full text-center rounded-md border border-transparent bg-gray-600 py-3 px-4 text-xl font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50">予約を修正する</a>
      </Link>
    </div>
  )
}

export default ShoppingView