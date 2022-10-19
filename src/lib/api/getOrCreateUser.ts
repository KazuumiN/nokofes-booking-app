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
    let counter = 0
    // ユーザーを作成するために、ユニークな数字8桁の文字列を生成
    let tempNumberId = "00000000"
    while (counter < 20) {
      // tempNumberIdをランダムに生成
      tempNumberId = Math.floor(Math.random() * 100000000).toString()
      // 8桁になるように1を左詰め
      tempNumberId = tempNumberId.padStart(8, "1")
      // 該当のnumberIdを持たないかチェック
      const checkUser = await client.attendee.findUnique({
        where: {
          numberId: tempNumberId
        }
      })
      if (!checkUser) {
        // 持たないことが確認できたのでbreak
        break
      }
      counter += 1
      if (counter==10) {
        throw new Error('tried 10 times but could not find unique numberId')
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