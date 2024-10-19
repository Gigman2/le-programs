import BusRound from '@/backend/controllers/BusRound';
import { routeGuard } from '@/backend/middlewares/routeGuard';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case 'POST':
                return BusRound.busBranchSummary(req, res);

            default:
                break;
        }
    } catch (error) {
        return res.status(400).json({ error: error })
    }

}

export default routeGuard(true)(handler);