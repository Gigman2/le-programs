import BusRound from '@/models/bus_round';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment';


import { connectMongo } from '../../../utils/connectMongo';



const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {


    try {
        await connectMongo();
        let data = req.body
        let busRound;
        data = (typeof data === 'string' && data.length > 2) ? JSON.parse(data) : {}
        busRound = (await BusRound.find(data)).reverse();
        let response = {}
        if (busRound) {
            const groupByMonthAndYear = busRound.reduce((acc, cValue) => {
                const item = {
                    eventName: "",
                    totalBuses: 0,
                    peopleBused: 0,
                    offering: 0,
                    cost: 0
                }
                const monthYear = moment(cValue.created_on).format("MMMM YYYY")
                if (!acc[monthYear]) acc[monthYear] = {}

                const daysInMonth = moment(cValue.created_on).format("dddd DD")
                if (!acc[monthYear][daysInMonth]) acc[monthYear][daysInMonth] = {}

                item.totalBuses = (acc[monthYear][daysInMonth].totalBuses || 1) + 1
                item.cost = (acc[monthYear][daysInMonth].cost || 0) + cValue.totalFare || 0
                item.offering = (acc[monthYear][daysInMonth].offering || 0) + cValue.busFare || 0
                item.peopleBused = (acc[monthYear][daysInMonth].peopleBused || 0) + cValue.totalPeople || 0

                acc[monthYear][daysInMonth] = item
                return acc
            }, {})

            response = groupByMonthAndYear
        }

        return res.status(200).json({ message: 'created Successfully', data: response, })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }

}



export default handler;