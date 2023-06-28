import BusRound from '@/backend/controllers/BusRound';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    console.log(req.query, req.method)
    switch (req.method) {
      case 'GET':
        return BusRound.get(req, res);

      case 'POST':
        return BusRound.insert(req, res);
      default:
        break;
    }
  } catch (error) {
    return res.status(400).json({ error: error })
  }

}



export default handler;