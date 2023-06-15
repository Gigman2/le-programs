import BusRound from '@/backend/models/busRound';
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
    const busRound = await BusRound.create(data);
    return res.status(200).json({ message: 'created Successfully', data: busRound, })
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error })
  }

}



export default handler;