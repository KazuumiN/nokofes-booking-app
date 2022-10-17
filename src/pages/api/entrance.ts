import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"
import getOrCreateUser from "lib/api/getOrCreateUser"
import checkUserType from "lib/api/checkUserType"

// 各日の一般の入場者数上限
const eachLimit = 6

const getEntrance = async (token: any) => {
  // ユーザーを取得。無ければ作って取得
  return await getOrCreateUser(token)
}

const patchEntrance = async (token: any, data: any) => {
  const { sub } = token;
  let { eleventh, twelfth, thirteenth, accompaniers } = data;

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
  }
  
  const userEleventhNum = eleventh==1 ? 1 + accompaniers : 0;
  const userTwelfthNum = twelfth==1 ? 1 + accompaniers : 0;
  const userThirteenthNum = thirteenth==1 ? 1 + accompaniers : 0;
  
  // トランザクション処理
  return await client.$transaction(async (tx) => {
    const users = await tx.attendee.aggregate({
      _sum: {
        numberOnEleventh: true,
        numberOnTwelfth: true,
        numberOnThirteenth: true,
      }
    })

    if (users._sum.numberOnEleventh + userEleventhNum > eachLimit || users._sum.numberOnTwelfth + userTwelfthNum > eachLimit || users._sum.numberOnThirteenth + userThirteenthNum > eachLimit) {
      throw new Error('上限を超えています')
    }
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
    return user
  })
}

// @ts-ignore
const entranceApi = async (req, res) => {
  const token = await getToken({ req })
  switch (req.method) {
    case 'GET':
      // @ts-ignore
      if (token) {
        const user = await getEntrance(token)
        res.status(200).json(user)
      } else {
        // サインインしていない
        res.status(401)
      }
      return
    case 'PATCH':
      // @ts-ignore
      if (token) {
        const user = await patchEntrance(token, req.body)
        res.status(200).json(user)
        return
      }
      res.status(200).json({ message: 'PATCH' })
      break

    default:
      res.status(405).end()
      break
  }
}



export default entranceApi
