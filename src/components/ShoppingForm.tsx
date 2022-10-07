import ProductCard from "../components/ProductCard";
import { shoppingProps, productType } from "../types"

interface Props {
  id: string;
  data: shoppingProps;
  products: productType[];
  returnToHome: () => void;
  closeForm: () => void;
}

const ShoppingForm = ({ id, data, products, returnToHome, closeForm }: Props) => {
  // TODO: dataの中身は標準で表示させるのみ。新しいstateも作る。
  const cancel = () => {
    // TODO: 記入済みのデータが消える警告モーダルを表示
    if (data.reserved) {
      closeForm();
    } else {
      returnToHome();
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
    closeForm();
  }
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold">{data.reserved ? "予約の修正" : "商品の予約"}</h1>
      <div className="flex flex-col space-y-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <h2 className="mt-8 text-xl font-semibold">
        お受け渡し日時
      </h2>
      <p className="text-sm mt-2 whitespace-pre-wrap">
        {"シクラメンをご予約の方は11月13,14日のみ、\n味噌または乳酸菌をご予約の方は11月14日のみをお選びください\n午前か午後かに関しましては厳密でなくとも大丈夫です。"}
      </p>
      <section
        aria-labelledby="summary-heading"
        className="my-16 rounded-lg bg-gray-50 px-4 py-6"
      >
        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-xl font-semibold text-gray-900">合計金額</dt>
            <dd className="text-xl font-medium text-gray-900">¥{1100}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <button
            type="button"
            className="w-full rounded-md border border-transparent bg-green-600 py-3 px-4 text-xl font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            onClick={submit}
          >
            {data.reserved ? "予約を修正する" : "予約する"}
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