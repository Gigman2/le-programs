import BusRound from '@/models/bus_round';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { connectMongo } from '../../../utils/connectMongo';

const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    await connectMongo();
    const data = JSON.parse(req.body)
    const busRound = await BusRound.find(data);
    return res.status(200).json({ message: 'created Successfully', data: busRound, })
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error })
  }

}



export default handler;