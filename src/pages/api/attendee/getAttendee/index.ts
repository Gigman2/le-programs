import Attendee from '@/models/attendee';
import { connectMongo } from '@/utils/connectMongo';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'





const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        await connectMongo();
        const data = JSON.parse(req.body)
        const attendee = await Attendee.find(data);
        return res.status(200).json({ message: 'created Successfully', data: attendee, })
    } catch (error) {
        return res.status(400).json({ error: error })
    }
}



export default handler;