import BusRound from '@/backend/controllers/BusRound';
import ChurchHeadCount from '@/backend/controllers/Headcount';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case 'GET':
                return ChurchHeadCount.get(req, res);

            case 'POST':
                return ChurchHeadCount.insert(req, res);

            default:
                break;
        }
    } catch (error) {
        return res.status(400).json({ error: error })
    }

}



export default handler;