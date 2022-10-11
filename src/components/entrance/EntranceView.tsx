import { entranceProps } from "../../types";

interface Props {
  id: string;
  data: entranceProps;
  openForm: () => void;
}

const EntranceView = ({ id, data, openForm }: Props) => {
  const convaertDate = (date: number) => {
    switch (date) {
      case 11:
        return "11月11日（金）";
      case 12:
        return "11月12日（土）";
      case 13:
        return "11月13日（日）";
      default:
        return "";
    }
  }
  return (
    <div className="w-full px-3">
      <p className="text-base font-medium sm:text-sm">
        ご来場日
      </p>
      <ul className="ml-8 list-disc">
        {data.dates.map((date) => (
          <li key={date} className="mt-4 sm:col-span-2 sm:mt-0">
            {convaertDate(date)}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-base font-medium sm:text-sm">
        同伴者数
      </p>
      <p className="mt-4 ml-8 sm:col-span-2 sm:mt-0">
        {data.accompaniers}名
      </p>
      <div className="flex justify-around">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          トップに戻る
        </button>
        <button
          type="button"
          className="rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={openForm}
          >
          修正する
        </button>
      </div>
    </div>
  )
}

export default EntranceView