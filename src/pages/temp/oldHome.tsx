// @ts-nocheck
import NumberAndQR from 'components/NumberAndQR';
import Button from 'components/Button'
import { pageType, userType } from "types";


interface Props {
  id: string;
  entranceReserved: boolean;
  shoppingReserved: boolean;
  moveTo: (page: pageType) => void;
}

const Home = ({id, entranceReserved, shoppingReserved, moveTo}: Props) => {
  return (
    <>
      {id && (entranceReserved || shoppingReserved) && (
        <NumberAndQR id={id} />
      )}
      <div className="flex justify-between space-x-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
          onClick={() => moveTo('entrance')}
        >
          {entranceReserved ? "入場予約\n確認修正" : "入場予約\n申し込み"}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
          onClick={() => moveTo('shopping')}
        >
          {shoppingReserved ? "販売予約\n確認修正" : "販売予約\n申し込み"}
        </button>
      </div>
    </>
  )
}

export default Home