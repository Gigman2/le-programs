import BusAccount from '@/backend/controllers/BusAccount';
import { routeGuard } from '@/backend/middlewares/routeGuard';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case "GET":
                return BusAccount.fullSingleAccount(req, res);

            case "POST":
                return BusAccount.update(req, res);

            case "DELETE":
                return BusAccount.update(req, res);

            default:
                return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }

}

export default routeGuard(true)(handler);
