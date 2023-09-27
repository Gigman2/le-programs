import BusRound from '@/backend/controllers/BusRound';
import axios from 'axios';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    const { email, password } = req.body;
    const AUTH_URL: string  = `${process.env.AUTH_URL}`
    try {
        switch (req.method) {
            case 'GET':
                return BusRound.get(req, res);

            case 'POST':
               // axios.post({email,password})
               const response = await axios.post(AUTH_URL,req.body,);

               
                return 

            default:
                break;
        }
    } catch (error) {
        return res.status(400).json({ error: error })
    }

}