import HeadCount from '@/models/head_count';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'


import { connectMongo } from '../../../../utils/connectMongo';



const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    await connectMongo();
    const data = JSON.parse(req.body)
    const payload = await HeadCount.find(data);
    return res.status(200).json({ message: 'Successful', data: payload })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
}



export default handler;