import Attendee from '@/backend/models/attendee';
import BusGroup from '@/backend/models/busGroups';
import BusRound from '@/backend/models/busRound';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'


import { connectMongo } from '../../../backend/utils/connectMongo';



const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {


    try {

        await connectMongo();
        //   const attendee = await Attendee.find();
        const busGroup = await BusGroup;

        let busPipeline = [
            {
                $group: {
                    _id: null,
                    totalBuses: { $sum: '$totalBuses' }
                }
            }
        ]

        let waitingPipeline = [


            { $match: { busState: { $eq: ['WAITING'] }, }, },
            {
                $group: {
                    _id: '$busState',
                    count: { $sum: 1 }
                }
            }

        ]

        let enRoutePipeline = [


            { $match: { busState: { $eq: ['EN_ROUTE'] }, }, },
            {
                $group: {
                    _id: '$busState',
                    count: { $sum: 1 }
                }
            }

        ]
        let arrivedPipeline = [


            { $match: { busState: { $eq: ['ARRIVED'] }, }, },
            {
                $group: {
                    _id: '$busState',
                    count: { $sum: 1 }
                }
            }

        ]


        let busRoundPipeline2 = [{
            $group: {
                _id: null,
                moving: { $sum: { $cond: [{ $eq: ["$busState", "EN_ROUTE"] }, 1, 0] } },
                waiting: { $sum: { $cond: [{ $eq: ["$busState", "EN_ROUTE"] }, 1, 0] } },
                arrived: { $sum: { $cond: [{ $eq: ["$busState", "ARRIVED"] }, 1, 0] } }
            }
        }
        ]


        let memberPipeline = [


            { $match: { busState: { $eq: ['EN_ROUTE'] }, }, },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }

        ]

        const busData = await busGroup.aggregate(busPipeline);

        const busWaiting = await await BusRound.aggregate(waitingPipeline)
        const busEnroute = await await BusRound.aggregate(enRoutePipeline)
        const busArrived = await await BusRound.aggregate(arrivedPipeline)

        const memberCount = await Attendee.find().count()


        const member = await BusRound;

        // const waitingMembers = member.aggregate(memberPipeline)










        return res.status(200).json({
            message: 'created Successfully',
            busData: { busData, waiting: busWaiting, enRoute: busEnroute, arrived: busArrived },
            memberData: { totalMembers: memberCount }
        },)



        //   res.status(200).json({ message: 'Unsucessful',  })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }

}



export default handler;