import { getToken } from "next-auth/jwt"
import client from "lib/prismadb"
import getOrCreateUser from "lib/api/getOrCreateUser"
import checkUserType from "lib/api/checkUserType"
import type { NextApiRequest, NextApiResponse } from 'next'

const patchvoteForMogi = async (token: any, data: any) => {
  const { sub } = token;
  let { vote } = data;
  const res = await client.voteMogi.upsert({
    where: {
      attendeeId: sub,
    },
    create: {
      attendeeId: sub,
      vote: vote,
    },
    update: {
      vote: vote,
    },
  })
  return res;
}


const voteForMogiApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  switch (req.method) {
    case 'GET':
      if (token) {
        // コメントアウトするならフロント側も修正必須
        // const entrance = await client.actual.findFirst({
        //   where: {
        //     attendeeId: token.sub,
        //   },
        //   select: {
        //     id: true,
        //   },
        // })
        // if (!entrance) {
        //   res.status(401).json({ message: 'not found' })
        //   return
        // }
        const currentVote = await client.voteMogi.findUnique({
          where: {
            attendeeId: token.sub,
          },
          select: {
            vote: true,
          },
        })
        res.status(200).json({currentVote: currentVote?.vote})
      } else {
        // サインインしていない
        res.status(401)
      }
      return
    case 'PATCH':
      if (token) {
        const vote = await patchvoteForMogi(token, req.body)
        res.status(200).json(vote)
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



export default voteForMogiApi
