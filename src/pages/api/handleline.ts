// nextjsのapi handlerをtypescriptで定義する
import { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // リクエストからaccessTokenを受け取り、変数accessTokenに入れる
  const accessToken = req.body.accessToken
  console.log(accessToken)
  // lineでaccessTokenを検証する
  // https://developers.line.biz/ja/reference/social-api/#verify-access-token
  // accessTokenを検証するためのURLを作成する
  const url = `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}&client_id=${process.env.LINE_CLIENT_ID}`
  // fetchを使ってaccessTokenを検証する
  const token = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      // 検証に成功したら、accessTokenを使ってuserIdを取得する
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('accessTokenの検証に失敗しました')
      }
    })
    return token
  }

export default handler