import { entranceProps } from "../types"

interface Props {
  id: string;
  data: entranceProps;
  returnToHome: () => void;
  closeForm: () => void;
}

const EntranceForm = ({ id, data, returnToHome, closeForm }: Props) => {
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
    <div className="w-full px-4">
      <div className="m-4">
        <div className="text-base font-medium sm:text-sm">
          ご来場日
        </div>
        {data.reserved && (
          <p>
            お申し込みを取り消されたい場合は、チェックを外して送信してください。
          </p>
        )}
        <div className="mt-4 sm:col-span-2 sm:mt-0">
          <div className="max-w-lg space-y-4">
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="eleventh"
                  name="eleventh"
                  type="checkbox"
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
        </div>
      </div>
      <div className="m-4">
        <label htmlFor="accompaniers" className="text-base font-medium sm:text-sm ">
          同伴者数
        </label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <input
            type="number"
            name="accompaniers"
            id="accompaniers"
            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
          />
        </div>
      </div>
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
            予約する
          </button>
        </div>
      </div>
    </div>
  )
}

export default EntranceForm