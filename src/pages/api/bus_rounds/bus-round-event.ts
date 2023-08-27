import BusRound from '@/models/bus_round';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment';


import { connectMongo } from '../../../utils/connectMongo';
import { IBusRound } from '@/interface/bus';
import BusGroup from '@/models/bus_groups';
import { IBusGroups } from '@/utils/interfaces';



const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {


    try {
        await connectMongo();
        let reqQuery = req.query

        const query = {
            busGroup: { $exists: true, $ne: null },
            created_on: {
                $gt: moment(reqQuery.date).startOf('day').toDate(),
                $lt: moment(reqQuery.date).endOf('day').toDate(),
            }
        }
        let busRound;

        busRound = (await BusRound.find(query)).reverse();
        const busInfo = {
            'Total Buses': 0,
            'Arrived': 0,
            'On Route': 0
        }
        const peopleInfo = {
            'People': 0,
            'Arrived': 0,
            'On Route': 0,
        }
        const financeInfo = {
            'Fare Collected': 0,
            'Actual Fare': 0
        }
        let groupedByZone: Record<string, IBusRound[]> = {}
        let groupedByZoneName: Record<string, IBusRound[]> = {}


        if (busRound) {
            const document = JSON.parse(JSON.stringify(busRound)) as IBusRound[]

            document.forEach(item => {
                busInfo['Total Buses'] += 1
                if (item.busState === 'ARRIVED') {
                    busInfo['Arrived'] += 1
                    peopleInfo['Arrived'] += Number(item.totalPeople)
                } else if (item.busState === 'EN_ROUTE') {
                    busInfo['On Route'] += 1
                    peopleInfo['On Route'] += Number(item.totalPeople)
                }

                peopleInfo['People'] += Number(item.totalPeople)

                financeInfo['Fare Collected'] += Number(item.busFare)
                financeInfo['Actual Fare'] += Number(item.totalFare)
            })
            groupedByZone = document.reduce((acc: Record<string, any>, cValue: IBusRound) => {
                if (!acc[cValue.busGroup]) acc[cValue.busGroup] = []
                acc[cValue.busGroup].push(cValue)
                return acc
            }, {})


            const zoneKeys = Object.keys(groupedByZone)
            const zones = await BusGroup.find({ _id: { '$in': zoneKeys } }) as IBusGroups[]

            zones.forEach(item => {
                groupedByZoneName[item.groupName] = groupedByZone[item._id as string]
            })
        }

        return res.status(200).json({ message: 'created Successfully', data: { zones: groupedByZoneName, busInfo, peopleInfo, financeInfo }, })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }

}



export default handler;