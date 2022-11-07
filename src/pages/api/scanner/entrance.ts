import client from "lib/prismadb"
import type { NextApiRequest, NextApiResponse } from 'next'

const scanEntranceApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  switch (method) {
    case 'GET':
      res.setHeader('Access-Control-Allow-Origin', '*');
      const id = query.id as string;
      const type = query.type as string;
      const place = query.place as string;
      const user = type === 'number'
        ? await client.attendee.findFirst({
            where: { numberId: id },
            select: {
              id: true,
              eleventh: true,
              twelfth: true,
              thirteenth: true,
              accompaniers: true,
            },
          })
        : await client.attendee.findFirst({
            where: { longerId: id },
            select: {
              id: true,
              eleventh: true,
              twelfth: true,
              thirteenth: true,
              accompaniers: true,
            },
          });
      if (!user) {
        res.status(404).json({ message: 'not found' });
        return;
      }
      res.status(200).json({
        eleventh: user.eleventh,
        twelfth: user.twelfth,
        thirteenth: user.thirteenth,
        accompaniers: user.accompaniers,
      })
      await client.actual.create({
        data: {
          attendeeId: user.id,
          place: place,
        },
      })
      return
    default:
      res.status(405).end()
      break
  }
}



export default scanEntranceApi
