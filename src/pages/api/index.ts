import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"
import getOrCreateUser from "lib/api/getOrCreateUser"

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
    // ユーザーを取得。無ければ作って取得
  const user = await getOrCreateUser(token)
  return {
    numberId: user.numberId,
    longerId: user.longerId,
    userType: user.userType,
    entranceReserved: !!(user.eleventh || user.twelfth || user.thirteenth),
    shoppingReserved: !!(user.original || user.sour || user.miso || user.lactic)
  }
}

export default indexApi
