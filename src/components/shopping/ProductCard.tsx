import { useState } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { productType } from '../../types'
import Image from 'next/image';

export const BeerCard = ({originalCount, setOriginalCount, sourCount, setSourCount, ...props}: any) => {
  console.log(originalCount)
  console.log(sourCount)
  return (
    <section className='flex flex-col items-end space-y-4'>
      {/* <PriceCard price={props.price} /> */}
      <div className="rounded-md border-2 border-black flex flex-col p-2 space-y-1">
        <div className="flex">
          <Image src={props.imageUrl} alt={props.name} className="w-1/4 -mt-2 -ml-2 mr-2" width={400} height={100} />
          <div className="flex flex-col justify-between">
            <h3 className="text-xl text-black font-bold">
              {props.name}
            </h3>
            <p className="text-sm">
              {props.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {props.items.map((item, index) => {
            const isLast = props.items.length - 1 === index;
            return (
            <>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <p className='text-xl font-bold'>{item.name}</p>
                </div>
                <div className="flex justify-between" key={item.name}>
                  <StockStatus stock={item.stock} />

                  <div className="flex items-center space-x-3">
                    <p className="font-semibold text-gray-500">
                      {item.unit}
                    </p>
                    <p className="font-semibold">{item.price}円</p>
                    <BuyAmountChanger stock={item.stock} limit={0} />
                  </div>
                </div>
              </div>
              {!isLast && <hr />}
            </>
          )})}
        </div>
      </div>
    </section>
  )
}

export const MisonyuCard = ({misoCount, setMisoCount, lacticCount, setLacticCount, ...items}: any) => {
  console.log(items)
  return (
    <>
      {items.items.map((item: any) => (
        <section key={item.id} className='flex flex-col items-end'>
          {/* <PriceCard price={item.price} /> */}
          <div className="rounded-md border-2 border-black flex flex-col p-2 space-y-1">
            <div className="flex">
              <Image src={item.imageUrl} alt={item.name} className="w-1/4 -mt-2 -ml-2 mr-2" width={400} height={100} />
              <div className="flex flex-col justify-between">
                <h3 className="text-xl text-black font-bold">
                  {item.name}
                </h3>
                <p className="text-sm">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <StockStatus stock={item.stock} />
              <div className="flex items-center space-x-3">
                <p className="font-semibold text-gray-500">
                  {item.unit}
                </p>
                <p className="font-semibold">{item.price}円</p>
                <BuyAmountChanger stock={item.stock} limit={item.limit} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

const PriceCard = ({price}: {price: number}) => {
  return (
    <div className="bg-neutral-100 z-50 p-1 shadow-sm -mr-4 -mb-4">
      <div className="rounded-md border-4 border-red-500">
        <div className="rounded-xl border-2 border-neutral-100">
          <div className="rounded-sm border-2 border-red-500">
            <p className="text-xl space-x-1 ml-1 mr-3">
              <span className="text-red-500">¥</span><span className="font-semibold text-gray-500">{price.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const StockStatus = ({ stock }: { stock: number }) => {
  const Icons = {
    green: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    yellow: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />,
    red: <XCircleIcon className="h-5 w-5 text-red-500" />,
  }
  if (stock > 10) {
    return <div className="flex items-center space-x-1">{Icons.green} <p>在庫あり</p></div>
  } else if (stock > 0) {
    return <div className="flex items-center space-x-1">{Icons.yellow} <p>在庫少し</p></div>
  } else {
    return <div className="flex items-center space-x-1">{Icons.red} <p>在庫なし</p></div>
  }
}

const BuyTimeChanger = ({days}: {days: string[]}) => {
  return (
    <select
      id="b"
      name="b"
      className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
    >
      {days.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>
  )
}

const BuyAmountChanger = ({stock, limit}: {stock: number, limit: number}) => {
  const [query, setQuery] = useState('')
  const [selectedOption, setSelectedOption] = useState(0)
  
  const options = [...Array((limit ? Math.min(stock,limit) : stock)+1)].map((_, i) => i)
  return (
    <select
      id="a"
      name="a"
      className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
