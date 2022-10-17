import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"
import checkUserType from "lib/api/checkUserType"
import getOrCreateUser from "lib/api/getOrCreateUser"

// 在庫を定義
const stock = {
  original: 150,
  sour: 150,
  miso: 100,
  lactic: 100,
}
const getStock = async (order: any) => {
  const { original, sour, miso, lactic } = order;
  

  // 注文を取得
  const orderedCount = await client.attendee.aggregate({
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
    description: "農工大ルーツのブルーベリーから手絞りで果汁を絞り出し、\n超音波熟成の技術を用いて仕上げました。農工大OBのブルワーさんと共に作り上げた贅沢なクラフトビールです!!",
    items: [
      {
        id: 'original',
        name: 'オリジナル',
        description: 'フルーティで豊かな香りを感じる一杯',
        unit: '330ml',
        price: 900,
      },
      {
        id: 'sour',
        name: 'サワーエール',
        description: '果実と酸味の組み合わせを楽しむ一杯',
        unit: '330ml',
        price: 900,
      }
    ],
  }

  const misonyuProducts = {
    name: "味噌乳酸菌市",
    description: "毎年大人気のみそにゅーですが、今年は事前予約制の限定販売です。農工大産のこだわりの逸品をどうぞ！",
    items: [
      {
        id: 'miso',
        name: 'エンレイ大豆味噌',
        description: '天然醸造の生味噌を学園祭のお土産に',
        unit: '330ml',
        price: 500,
      },
      {
        id: 'lactic',
        name: '乳酸菌飲料',
        description: "農工大の乳牛による新鮮な生乳を使用",
        unit: '500ml',
        price: 500,
      }
    ]
  }
  
  // 毎年大人気のみそにゅーですが、今年は事前予約制の限定販売です。農工大産のこだわりの逸品をどうぞ！
  const misoProduct = {
    name: "エンレイ大豆味噌",
    description: "原料のコメとダイズの栽培から仕込みまで、すべての工程を農工大で行っています。天然醸造の生味噌を学園祭のお土産にいかがですか？",
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
    description: "農工大で飼育されている乳牛から搾られた新鮮な生乳を使用した乳酸菌飲料です。目安は4倍希釈ですが、お好みの濃さに調節して楽しんでください！",
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
    misonyuProducts,
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

const patchShopping = async (token: any, data: any) => {
  const { sub } = token;
  let { original, sour, miso, lactic, whenToBuy } = data;
  console.log(data)

  // 全て自然数であることを確認し、そうでない時はerror
  if ((original < 0 || sour < 0 || miso < 0 || lactic < 0) && !(Number.isInteger(original) && Number.isInteger(sour) && Number.isInteger(miso) && Number.isInteger(lactic))) {
    throw new Error("invalid input")
  }
  if (((miso || lactic) && ![1,2,3].includes(whenToBuy)) || ![0,1,2,3].includes(whenToBuy)) {
    throw new Error("invalid whenToBuy")
  }
  
  // トランザクション処理
  return await client.$transaction(async (tx) => {
    const users = await tx.attendee.aggregate({
      _sum: {
        original: true,
        sour: true,
        miso: true,
        lactic: true,
      }
    })

    //if (users._sum.original + userEleventhNum > eachLimit || users._sum.numberOnTwelfth + userTwelfthNum > eachLimit || users._sum.numberOnThirteenth + userThirteenthNum > eachLimit) {
    if (users._sum.original + original > stock.original || users._sum.sour + sour > stock.sour || users._sum.miso + miso > stock.miso || users._sum.lactic + lactic > stock.lactic) {
      throw new Error('在庫数の上限を超えています')
    }

    if (whenToBuy) {
      const whenToBuyCurrent = await tx.attendee.count({
        where: {
          whenToBuy: whenToBuy,
        }
      })
      if (whenToBuyCurrent + 1 > 60) {
        throw new Error('受け取り日時の上限を超えています')
      }
    }


    const user = await tx.attendee.update({
      data: {
        original,
        sour,
        miso,
        lactic,
        whenToBuy,
      },
      where: { 
        id: sub
      },
    })
    // 注文をしている人は予約を取り消せない
    if ((user.original || user.sour || user.miso || user.lactic) && !(user.eleventh || user.twelfth || user.thirteenth)) {
      throw new Error ('物販予約済みなのに入場予約しないのはまずい（おそらくローカルで処理するはずのエラー）')
    }
    // 味噌乳酸菌を注文している人は日曜日を取り消せない
    if ((user.miso || user.lactic) && user.thirteenth === 0) {
      throw new Error ('味噌乳酸菌を注文しているのに日曜日を取り消すのはまずい（おそらくローカルで処理するはずのエラー）')
    }
    return user
  })
}

// @ts-ignore
const shoppingApi = async (req, res) => {
  // @ts-ignore
  const token = await getToken({ req })
  switch (req.method) {
    case 'GET':
      if (token) {
        // Signed in
        const order = await getOrCreateUser(token)
        const stock = await getStock(order)
        const shopItems = getShopItems()
        const data = { order, stock, shopItems, times }
        res.status(200).json(data)
      } else {
        // Not Signed in
        res.status(401)
      }
      return 
    case 'PATCH':
      // @ts-ignore
      if (token) {
        const user = await patchShopping(token, req.body)
        res.status(200).json(user)
      } else {
        // サインインしていない
        res.status(401)
      }
      return
    default:
      res.status(405).end()
      break
  }
}



export default shoppingApi
