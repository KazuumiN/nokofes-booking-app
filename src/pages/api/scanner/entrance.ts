import client from "lib/prismadb"
import type { NextApiRequest, NextApiResponse } from 'next'

const scanEntranceApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, method } = req;
  switch (method) {
    case 'POST':
      // まずはユーザーデータを返す
      const userInfo = await getInfo(body)
      res.status(200).json(userInfo)
      // GASに保存
      await postGas(body)
      return
    default:
      res.status(405).end()
      break
  }
}

type postProps = {
  id: string,
  type?: 'longer' | 'number',
  place?: 'seimon' | 'yongokan'
}

const getInfo = async ({id, type}: postProps) => {
  // DBからユーザーを取得
  const query = type === 'number' ? { numberId: id } : { longerId: id }
  const user = await client.attendee.findFirst({
    where: query,
    select: {
      id: true,
      eleventh: true,
      twelfth: true,
      thirteenth: true,
      accompaniers: true
    }
  })
  return {...user}
}

const postGas = async ({id, place}: postProps) => {
  // GASに保存
  let status = 0
  let counter = 0
  // エラーの場合は10回再試行するループ
  while ((counter < 10) && (status != 200)) {
    const res = await fetch(`${process.env.GAS_ENDPOINT_FOR_SCANNER}?id=${id}&place=${place}`)
    // statusをcheck
    status = res.status;
    counter ++
  }
  // 10回超えたらエラーをconsoleに置いとく（流石にないと思うけど）
  if (counter<10) {
    console.log(`error in recording ${id}`)
  }
}

export default scanEntranceApi
