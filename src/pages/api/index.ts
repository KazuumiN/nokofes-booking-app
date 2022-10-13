import checkUserType from "lib/api/checkUserType"
import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"

// @ts-ignore
const indexApi = async (req, res) => {
  switch (req.method) {
    case 'GET':
      // @ts-ignore
      const token = await getToken({ req })
      if (token) {
        const user = await getId(token)
        res.status(200).json(user)
      } else {
        // サインインしていない
        res.status(401)
      }
      return
    case 'POST':
      res.status(200).json({ message: 'POST' })
      break

    case 'PATCH':
      res.status(200).json({ message: 'PATCH' })
      break

    case 'DELETE':
      res.status(200).json({ message: 'PATCH' })
      break

    default:
      res.status(405).end()
      break
  }
}

const getId = async (token: any) => {
  const { sub } = token;
  
  // ユーザーを取得
  let user = await client.attendee.findUnique({
    where: {
      id: sub
    },
    include: {
      entrance: {
        select: {
          eleventh: true,
          twelfth: true,
          thirteenth: true,
        }
      },
      shopping: {
        select: {
          original: true,
          sour: true,
          miso: true,
          lactic: true,
        }
      },
    }
  })

  //　ユーザーが存在しない場合
  if (!user) {
    // ユーザーを作成するために、ユニークな数字8桁の文字列を生成
    let tempNumberId = "00000000"
    while (true) {
      // 該当のnumberIdを持たないかチェック
      tempNumberId = Math.floor(Math.random() * 100000000).toString()
      const checkUser = await client.attendee.findUnique({
        where: {
          numberId: tempNumberId
        }
      })
      if (!checkUser) {
        // 持たないことが確認できたのでbreak
        break
      }
    }
    // @ts-ignore
    user = await client.attendee.create({
      data: {
        id: sub,
        numberId: tempNumberId,
        entrance: {
          create: {}
        },
        shopping: {
          create: {},
        }
      }
    })
  }

  return {
    numberId: user?.numberId,
    longerId: user?.longerId,
    userType: checkUserType(token),
    entranceReserved: !!(user?.entrance?.eleventh || user?.entrance?.twelfth || user?.entrance?.thirteenth),
    shoppingReserved: !!(user?.shopping?.original || user?.shopping?.sour || user?.shopping?.miso || user?.shopping?.lactic)
  }
}

export default indexApi
