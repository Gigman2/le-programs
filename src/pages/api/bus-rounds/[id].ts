import BusRound from '@/backend/controllers/BusRound';
import { authenticateUser } from '@/backend/middlewares/authenticate';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case "GET":
                return BusRound.getById(req, res);

            case "POST":
                return BusRound.update(req, res);

            case "DELETE":
                return BusRound.update(req, res);

            default:
                break;
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }

}

export default authenticateUser(handler);