import BusGroup from '@/models/bus_groups';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'


import { connectMongo } from '../../../../utils/connectMongo';



const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    await connectMongo();
    const busGroup = await BusGroup.find();
    return res.status(200).json({ message: 'Successful', data: busGroup, })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
}



export default handler;