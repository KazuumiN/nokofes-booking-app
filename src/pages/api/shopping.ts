import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"
import checkUserType from "lib/api/checkUserType"

// @ts-ignore
const shoppingApi = async (req, res) => {
  // @ts-ignore
  const token = await getToken({ req })
  if (token) {
    // Signed in
    const order = await getOrder(token)
    const stock = await getStock(order)
    const shopItems = getShopItems()
    const data = { order, stock, shopItems, times }
    console.log(data)
    res.status(200).json(data)
  } else {
    // Not Signed in
    res.status(401)
  }
}

const getOrder = async (token: any) => {
  const { sub } = token;
  let order = await client.shopping.findUnique({
    where: {
      attendeeId: sub
    },
  })
  // 注文が存在しない場合
  if (!order) {
    order = await client.shopping.create({
      data: {
        attendeeId: sub,
      }
    })
  }
  return {
    userType: checkUserType(token),
    original: order.original,
    sour: order.sour,
    miso: order.miso,
    lactic: order.lactic,
    whenToBuy: order.whenToBuy,
  }
}

const getStock = async (order: any) => {
  const { original, sour, miso, lactic } = order;
  
  // 在庫を定義
  const stock = {
    original: 150,
    sour: 150,
    miso: 100,
    lactic: 100,
  }

  // 注文を取得
  const orderedCount = await client.shopping.aggregate({
    _sum: {
      original: true,
      sour: true,
      miso: true,
      lactic: true,
    }
  })

  // 自分の注文分も合わせてstockに足す
  stock.original = stock.original + original - (orderedCount._sum.original || 0)
  stock.sour = stock.sour + sour - (orderedCount._sum.sour || 0)
  stock.miso = stock.miso + miso - (orderedCount._sum.miso || 0)
  stock.lactic = stock.lactic + lactic - (orderedCount._sum.lactic || 0)

  return stock
}

const getShopItems = () => {
  const beerProducts = {
    name: "農工大クラフト",
    description: "芳醇なブルーベリーと超音波熟成の技術を使い、本場オレゴンで腕に磨きをかけたブルワーさんと共に贅沢な一品を完成させました！",
    items: [
      {
        id: 'original',
        name: 'オリジナル',
        unit: '330ml',
        price: 900,
      },
      {
        id: 'sour',
        name: 'サワー',
        unit: '330ml',
        price: 900,
      }
    ],
  }
  const misoProduct = {
    name: "エンレイ大豆味噌",
    description: "毎年大人気のみそにゅーですが、今年は事前予約制の限定販売です。農工大産のこだわりの逸品をどうぞ！",
    items: [
      {
        id: 'miso',
        unit: "900g",
        price: 500,
        limit: 5,
      }
    ],
  }
  const lacticProduct = {
    name: "乳酸菌飲料",
    description: "毎年大人気のみそにゅーですが、今年は事前予約制の限定販売です。農工大産のこだわりの逸品をどうぞ！",
    items: [
      {
        id: 'lactic',
        unit: "500ml",
        price: 500,
        limit: 5,
      },
    ],
  }
  return {
    beerProducts,
    misoProduct,
    lacticProduct
  }
}

const times = [
  // TODO: ここもユーザーの値によってremainingを増やす
  {
    id: 1,
    name: "11/13 10:00~12:00",
    remaining: 10,
  },
  {
    id: 2,
    name: "11/13 12:00~14:00",
    remaining: 10,
  },
  {
    id: 3,
    name: "11/13 14:00~16:00",
    remaining: 10,
  },
]

export default shoppingApi
