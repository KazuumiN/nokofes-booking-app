import { useState } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { productType } from '../types'
import Image from 'next/image';

const ProductCard = ({ id, name, description, unit, imageUrl, price, stock, limit }: productType) => {
  return (
    <section className='flex flex-col items-end'>
      <PriceCard price={price} />
      <div className="rounded-md border-2 border-black flex flex-col p-2 space-y-1">
        <div className="flex">
          <Image src={imageUrl} alt={name} className="w-1/4 -mt-2 -ml-2 mr-2" />
          <div className="flex flex-col justify-between">
            <h3 className="text-xl text-black font-bold">
              {name}
            </h3>
            <p className="text-sm">
              {description}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <StockStatus stock={stock} />
          <div className="flex items-center space-x-3">
            <p className="font-semibold text-gray-500">
              {unit}
            </p>
            <BuyAmountChanger stock={stock} limit={limit} />
          </div>
        </div>
      </div>
    </section>
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
    return <div className="flex items-center space-x-1">{Icons.green} <p>在庫あり：{stock}</p></div>
  } else if (stock > 0) {
    return <div className="flex items-center space-x-1">{Icons.yellow} <p>在庫少し：{stock}</p></div>
  } else {
    return <div className="flex items-center space-x-1">{Icons.red} <p>在庫なし</p></div>
  }
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

export default ProductCard