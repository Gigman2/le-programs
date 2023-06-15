import BusGroup from '@/backend/models/busGroups';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'


import { connectMongo } from '../../../backend/utils/connectMongo';



const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    await connectMongo();
    let data = req.body
    data = JSON.parse(data)
    const busGroup = await BusGroup.create(data)
    return res.status(200).json({ message: 'created Successfully', data: busGroup, })
  } catch (error) {
    return res.status(400).json({ message: error })
  }

}



export default handler;