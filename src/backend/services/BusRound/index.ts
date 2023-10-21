import { Model } from 'mongoose';
import { IBusRound } from '@/interface/bus'
import BaseService from '../Base';
import dayjs from 'dayjs';

export default class BusRoundService extends BaseService<IBusRound>  {
    protected readonly name = 'BusRound';

    constructor(protected readonly model: Model<IBusRound>) {
        super(model)
    }

    async summaryData(records: IBusRound[], zoneIds: string[]) {
        const arrivedBuses: string[] = []
        const enRouteBuses: string[] = []

        const busInfo = {
            total_buses: 0,
            arrived: 0,
            on_route: 0
        }
        const peopleInfo = {
            people: 0,
            arrived: 0,
            on_route: 0,
        }

        const financeInfo = {
            offering: 0,
            cost: 0
        }
        let nonActiveZones: string[] = zoneIds
        let unMetTarget: string[] = []

        records.forEach(item => {
            const zoneId = (item.busZone as unknown as { _id: string })?._id || item.busZone
            busInfo.total_buses += 1
            if (item.busState === 'ARRIVED') {
                busInfo.arrived += 1
                peopleInfo.arrived += Number(item.people)
                arrivedBuses.push(item._id as string)
            } else if (item.busState === 'EN_ROUTE') {
                busInfo.on_route += 1
                peopleInfo.on_route += Number(item.people)
                enRouteBuses.push(item._id as string)
            }

            peopleInfo.people += Number(item.people)

            financeInfo.offering += Number(item.busOffering)
            financeInfo.cost += Number(item.busCost)

            nonActiveZones = nonActiveZones.filter(f => String(f) !== String(zoneId))

            if (item.people < 8) {
                unMetTarget.push(item._id as string)
            }
        })

        return {
            busInfo,
            peopleInfo,
            financeInfo,
            unMetTarget,
            nonActiveZones,
            arrivedBuses,
            enRouteBuses
        }

    }
}