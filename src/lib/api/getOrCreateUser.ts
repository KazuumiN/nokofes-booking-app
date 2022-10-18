import client from "lib/prismadb"
import checkUserType from "lib/api/checkUserType"

const getOrCreateUser = async (token: any) => {
  let user = await client.attendee.findUnique({
    where: {
      id: token.sub
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
    user = await client.attendee.create({
      data: {
        id: token.sub,
        numberId: tempNumberId,
        email: token.email,
      }
    })
  }
  const userType = checkUserType(token)
  return {userType, ...user}
}

export default getOrCreateUser