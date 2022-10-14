import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"
import getOrCreateUser from "lib/api/getOrCreateUser"

// @ts-ignore
const entranceApi = async (req, res) => {
  switch (req.method) {
    case 'GET':
      // @ts-ignore
      const token = await getToken({ req })
      if (token) {
        const user = await getEntrance(token)
        res.status(200).json(user)
      } else {
        // サインインしていない
        res.status(401)
      }
      return
    case 'PATCH':
      res.status(200).json({ message: 'PATCH' })
      break

    default:
      res.status(405).end()
      break
  }
}

const getEntrance = async (token: any) => {
  // ユーザーを取得。無ければ作って取得
  const user = await getOrCreateUser(token)
  return {
    userType: user.userType,
    eleventh: user.eleventh,
    twelfth: user.twelfth,
    thirteenth: user.thirteenth,
    accompaniers: user.accompaniers,
  }
}

// const patchEntrance = async (token: any, data: any) => {
//   const { sub } = token;
//   let { eleventh, twelfth, thirteenth, accompaniers } = data;

//   // TODO: 実際はDBをロックしてカウントして、などの処理が必要
//   // TODO: 注文をしている人は予約を取り消せない
//   // TODO: 味噌乳酸菌を注文している人は日曜日を取り消せない
//   if (checkUserType(token) === 'nokodaisei') {
//     eleventh = [0, 1, 2].includes(eleventh) ? eleventh : 0;
//     twelfth = [0, 1, 2].includes(twelfth) ? twelfth : 0;
//     thirteenth = [0, 1, 2].includes(thirteenth) ? thirteenth : 0;
//     accompaniers = 0;
//   } else {
//     eleventh = [0, 1].includes(eleventh) ? eleventh : 0;
//     twelfth = [0, 1].includes(twelfth) ? twelfth : 0;
//     thirteenth = [0, 1].includes(thirteenth) ? thirteenth : 0;
//     accompaniers = [0,1,2,3,4].includes(accompaniers) ? accompaniers : 0;
//   }
//   await client.user.update({
//     where: {
//       id: sub
//     },
//     data: {
//       eleventh,
//       twelfth,
//       thirteenth,
//       accompaniers,
//     }
//   })
// }

export default entranceApi
