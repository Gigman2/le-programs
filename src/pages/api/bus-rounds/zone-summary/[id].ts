import BusRound from '@/backend/controllers/BusRound';
import { authenticateUser } from '@/backend/middlewares/authenticate';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case 'GET':
                return BusRound.busBranchSummary(req, res);

            default:
                break;
        }
    } catch (error) {
        return res.status(400).json({ error: error })
    }

}



export default authenticateUser(handler);