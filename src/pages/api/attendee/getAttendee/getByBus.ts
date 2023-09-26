import Attendee from '@/backend/models/attendee';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'


import { connectMongo } from '../../../../backend/utils/connectMongo';

const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    await connectMongo();
    const data = JSON.parse(req.body)
    if (data._id && typeof data._id === 'string') data._id = JSON.stringify(data._id)
    const attendee = await Attendee.find(data);
    return res.status(200).json({ message: 'created Successfully', data: attendee, })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
}



export default handler;