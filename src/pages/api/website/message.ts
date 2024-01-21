import WebsiteMessage from '@/backend/models/websiteModels/message';
import { connectMongo } from '@/backend/utils/connectMongo';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'



const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        if (req.method === 'POST') {
            await connectMongo("website_data");
            let data = req.body
            if (typeof data === 'string') data = JSON.parse(data)
            const record = await WebsiteMessage.create(data)
            return res.status(200).json({ message: 'created Successfully', data: record })
        }
        return
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }

}

export default handler;