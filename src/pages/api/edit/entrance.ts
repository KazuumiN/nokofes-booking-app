import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"
import getOrCreateUser from "lib/api/getOrCreateUser"
import checkUserType from "lib/api/checkUserType"
import type { NextApiRequest, NextApiResponse } from 'next'

// 各日の一般の入場者数上限
const eachLimit = 2801

const getStock = async (user: any) => {
  const users = await client.attendee.aggregate({
    _sum: {
      numberOnEleventh: true,
      numberOnTwelfth: true,
      numberOnThirteenth: true,
    }
  })
  // 自分の注文分も合わせてstockに足す
  const stockEleventh = eachLimit + user.numberOnEleventh - (users._sum.numberOnEleventh || 0)
  const stockTwelfth = eachLimit + user.numberOnTwelfth - (users._sum.numberOnTwelfth || 0)
  const stockThirteenth = eachLimit + user.numberOnThirteenth - (users._sum.numberOnThirteenth || 0)
  return {
    eleventh: stockEleventh,
    twelfth: stockTwelfth,
    thirteenth: stockThirteenth,
  }
}

const patchEntrance = async (token: any, data: any) => {
  const { sub } = token;
  let { eleventh, twelfth, thirteenth, accompaniers } = data;
  let userEleventhNum = 0;
  let userTwelfthNum = 0;
  let userThirteenthNum = 0;
  if (checkUserType(token) === 'nokodaisei') {
    eleventh = [0, 1, 2].includes(eleventh) ? eleventh : 0;
    twelfth = [0, 1, 2].includes(twelfth) ? twelfth : 0;
    thirteenth = [0, 1, 2].includes(thirteenth) ? thirteenth : 0;
    accompaniers = 0;
  } else {
    eleventh = [0, 1].includes(eleventh) ? eleventh : 0;
    twelfth = [0, 1].includes(twelfth) ? twelfth : 0;
    thirteenth = [0, 1].includes(thirteenth) ? thirteenth : 0;
    accompaniers = !(eleventh||twelfth||thirteenth) ? 0 : [0,1,2,3,4].includes(accompaniers) ? accompaniers : 0;
    userEleventhNum = eleventh==1 ? 1 + accompaniers : 0;
    userTwelfthNum = twelfth==1 ? 1 + accompaniers : 0;
    userThirteenthNum = thirteenth==1 ? 1 + accompaniers : 0;
  }
  
  
  // トランザクション処理
  return await client.$transaction(async (tx) => {
    const user = await tx.attendee.update({
      data: {
        eleventh: eleventh,
        twelfth: twelfth,
        thirteenth: thirteenth,
        accompaniers: accompaniers,
        numberOnEleventh: userEleventhNum,
        numberOnTwelfth: userTwelfthNum,
        numberOnThirteenth: userThirteenthNum,
      },
      where: { 
        id: sub
      },
    })
    // 注文をしている人は予約を取り消せない
    if ((user.original || user.sour || user.miso || user.lactic) && !(eleventh || twelfth || thirteenth)) {
      throw new Error ('物販予約済みなのに入場予約しないのはまずい（おそらくローカルで処理するはずのエラー）')
    }
    // 味噌乳酸菌を注文している人は日曜日を取り消せない
    if ((user.miso || user.lactic) && thirteenth === 0) {
      throw new Error ('味噌乳酸菌を注文しているのに日曜日を取り消すのはまずい（おそらくローカルで処理するはずのエラー）')
    }
    
    const users = await tx.attendee.aggregate({
      _sum: {
        numberOnEleventh: true,
        numberOnTwelfth: true,
        numberOnThirteenth: true,
      }
    })
    if (((eachLimit-50 <= (users._sum.numberOnEleventh || 0)) && ((users._sum.numberOnEleventh || 0) <= eachLimit-45)) || ((eachLimit-50 <= (users._sum.numberOnTwelfth || 0)) && ((users._sum.numberOnTwelfth || 0) <= eachLimit-45)) || ((eachLimit-50 <= (users._sum.numberOnThirteenth || 0)) && ((users._sum.numberOnThirteenth || 0) <= eachLimit-45))) {
      await fetch('https://notify-api.line.me/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
        },
        body: `message=現在の予約\n11日：${(users._sum.numberOnEleventh || 0)}人\n12日：${(users._sum.numberOnTwelfth || 0)}人\n13日：${(users._sum.numberOnThirteenth || 0)}人`,
      });
    }
    if ((users._sum.numberOnEleventh || 0) > eachLimit || (users._sum.numberOnTwelfth || 0) > eachLimit || (users._sum.numberOnThirteenth || 0) > eachLimit) {
      throw new Error('上限を超えています')
    }
    return user
  })
}

const entranceApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  switch (req.method) {
    case 'GET':
      if (token) {
        const user = await getOrCreateUser(token)
        const stock = await getStock(user)
        res.status(200).json({user, stock})
      } else {
        // サインインしていない
        res.status(401)
      }
      return
    case 'PATCH':
      if (token) {
        const user = await patchEntrance(token, req.body)
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



export default entranceApi
