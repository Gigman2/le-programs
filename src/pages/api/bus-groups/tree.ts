import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import BusGroup from '@/backend/controllers/BusGroup';
import { authenticateUser } from '@/backend/middlewares/authenticate';
const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case 'GET':
                return BusGroup.getTree(req, res);
            default:
                return res.status(405).json({ message: "Method not allowed" });

        }
    } catch (error) {
        return res.status(400).json({ message: error })
    }

}



export default authenticateUser(handler);