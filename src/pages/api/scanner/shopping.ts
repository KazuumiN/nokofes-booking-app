import client from "lib/prismadb"
import type { NextApiRequest, NextApiResponse } from 'next'

const scanShoppingApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  switch (method) {
    case 'GET':
      res.setHeader('Access-Control-Allow-Origin', '*');
      const id = query.id as string;
      const shop = query.shop as string;
      const user = await client.attendee.findFirst({
        where: { longerId: id },
        select: {
          id: true,
          original: shop === 'beer',
          sour: shop === 'beer',
          miso: shop === 'misonyu',
          lactic: shop === 'misonyu',
          whenToBuy: shop === 'misonyu',
        },
      });
      if (!user) {
        res.status(404).json({ message: 'not found' });
        return;
      }
      res.status(200).json({
        original: user.original,
        sour: user.sour,
        miso: user.miso,
        lactic: user.lactic,
        whenToBuy: user.whenToBuy,
      })
      return
    default:
      res.status(405).end()
      break
  }
}


export default scanShoppingApi
