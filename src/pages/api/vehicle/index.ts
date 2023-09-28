import ChuchVehicle from '@/backend/controllers/Vehicle';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    switch (req.method) {
      case 'GET':
        return ChuchVehicle.get(req, res);

      case 'POST':
        return ChuchVehicle.insert(req, res);

      default:
        break;
    }
  } catch (error) {
    return res.status(400).json({ error: error })
  }
}

export default handler;