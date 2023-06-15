import BusRound from '@/backend/models/busRound';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { connectMongo } from '../../../backend/utils/connectMongo';
import { Schema } from 'mongoose';

const getHandler = async (id: string, res: NextApiResponse) => {
    const busRound = await BusRound.findById(id);
    return res.status(200).json({ message: 'Successful', data: busRound, })
}

const updateHandler = async (id: string, req: NextApiRequest, res: NextApiResponse) => {
    const data = JSON.parse(req.body)
    await BusRound.updateOne({ _id: id }, data);
    const busRound = await BusRound.findById(id);
    return res.status(200).json({ message: 'Update Successful', data: busRound, })
}

const deleteHandler = async (id: string, res: NextApiResponse) => {
    const busRound = await BusRound.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Successfully deleted', data: busRound, })
}

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        await connectMongo();
        const { id } = req.query
        if (id) {
            if (req.method === 'GET') {
                return getHandler(id as string, res)
            } else if (req.method === 'DELETE') {
                return deleteHandler(id as string, res)
            } else if (req.method === 'POST') {
                return updateHandler(id as string, req, res)
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }

}

export default handler;