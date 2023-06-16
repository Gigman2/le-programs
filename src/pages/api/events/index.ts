import ChurchEvent from '@/backend/controllers/Event';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case 'GET':
                return ChurchEvent.get(req, res);

            case 'POST':
                return ChurchEvent.insert(req, res);

            default:
                break;
        }
    } catch (error) {
        return res.status(400).json({ error: error })
    }

}



export default handler;