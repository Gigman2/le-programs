import BusAccount from '@/backend/controllers/BusAccount';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    switch (req.method) {
      case 'GET':
        return BusAccount.get(req, res);

      case 'POST':
        return BusAccount.insert(req, res);

      default:
        break;
    }
  } catch (error) {
    return res.status(400).json({ error: error })
  }
}



export default handler;