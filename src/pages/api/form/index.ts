import BusRound from '@/backend/controllers/BusRound';
import { busForm } from '@/frontend/store/auth';
import { BusFormData, IBusForm } from '@/utils/interfaces';
import axios from 'axios';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    const { email, password } = req.body;
    const AUTH_URL: string = "https://le-auth-api.onrender.com/api/v1/login";
    // `${process.env.AUTH_URL}`
    const data = { email, password }

    try {
        switch (req.method) {


            case 'POST':
                const results = await busForm(AUTH_URL, data);
                return res.status(200).json({ data: results.data })

            default:
                break;
        }
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }

}

export default handler;