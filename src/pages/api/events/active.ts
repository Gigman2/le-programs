import BusRound from '@/backend/controllers/BusRound';
import ChurchEvent from '@/backend/controllers/Event';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case 'POST':
                return ChurchEvent.activeEvent(req, res);
            default:
                return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        return res.status(400).json({ error: error })
    }

}



export default handler;