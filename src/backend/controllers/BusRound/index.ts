import BusAccountService from '@/backend/services/BusAccount';
import BaseController from '../Base';
import BusRoundService from '@/backend/services/BusRound';
import { Bus, BusAccount, BusGroup, Event } from "@backend/models";
import { NextApiRequest, NextApiResponse } from 'next';
import responses from '@/backend/lib/response';
import EventService from '@/backend/services/Event';
import BusGroupService from '@/backend/services/BusGroup';
import { IEvent } from '@/interface/events';
import dayjs from 'dayjs';
import { IBusGroups, IBusRound } from '@/interface/bus';
import AppCache from '@/backend/helpers/cache';
import { IUser } from '@/interface/misc';

class BusRoundController extends BaseController<BusRoundService> {
    protected name = 'BusGroup';
    constructor(service: BusRoundService, private busGroupService: BusGroupService, private eventService: EventService,) {
        super(service)
    }

    async busBranchSummary(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
            const cacheSystem = new AppCache()
            const active = await this.eventService.activeEvent(
                { group: (req.query as { id: string }).id },
                this.busGroupService
            ) as IEvent

            if (!active) return responses.error(res, "No active event")

            const eventStart = active?.occurrence === 'FIXED' ? dayjs(active.duration?.start).format('YYYY-MM-DDTHH:mm') : dayjs().startOf('day').format('YYYY-MM-DDTHH:mm')
            const eventEnd = active?.occurrence === 'FIXED' ? dayjs(active.duration?.end).format('YYYY-MM-DDTHH:mm') : dayjs().endOf('day').format('YYYY-MM-DDTHH:mm')
            const eventKey = `${active?._id}_${eventStart}_${eventEnd}_${active?.meetingType}`

            const allZonesInGroup = await this.busGroupService.get({ parent: this.service.objectId((req.query as { id: string }).id) })
            const zoneIds = allZonesInGroup.map(item => item._id)

            const busRoundPayload = {
                busZone: { '$in': zoneIds },
                tag: eventKey
            }


            let records = this.service.exposeDocument(
                await this.service.get(busRoundPayload)
            ) as IBusRound[]

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
            let groupedByZone: Record<string, IBusRound[]> = {}
            let groupedByZoneName: Record<string, IBusRound[]> = {}

            records.forEach(item => {
                const zoneId = (item.busZone as unknown as { _id: string })?._id || item.busZone
                busInfo.total_buses += 1
                if (item.busState === 'ARRIVED') {
                    busInfo.arrived += 1
                    peopleInfo.arrived += Number(item.people)
                } else if (item.busState === 'EN_ROUTE') {
                    busInfo.on_route += 1
                    peopleInfo.on_route += Number(item.people)
                }

                peopleInfo.people += Number(item.people)

                financeInfo.offering += Number(item.busOffering)
                financeInfo.cost += Number(item.busCost)

                if (item.people < 8) {
                    unMetTarget.push(item._id as string)
                }
                nonActiveZones = nonActiveZones.filter(f => String(f) !== String(zoneId))
            })

            records = await Promise.all(
                records.map(async item => {
                    const addedBy = (item.recordedBy as unknown as { _id: string })?._id || item.recordedBy
                    const key = addedBy + '_cached_user'
                    const user = await cacheSystem.getCachedData(key)
                    if (user) {
                        item.addedBy = JSON.parse(user)
                    }
                    return item
                })
            )
            groupedByZone = records.reduce((acc: Record<string, any>, cValue: IBusRound) => {
                const zoneId = (cValue.busZone as unknown as { _id: string })?._id || cValue.busZone as string

                if (!acc[zoneId]) acc[zoneId] = []
                acc[zoneId].push(cValue)
                return acc
            }, {})

            allZonesInGroup.forEach(item => {
                groupedByZoneName[item.name] = groupedByZone[item._id as string]
            })

            return responses.successWithData(res, {
                busInfo,
                peopleInfo,
                financeInfo,
                unMetTarget,
                notStarted: nonActiveZones,
                zones: groupedByZoneName,
            })
        } catch (error: any) {
            return responses.error(res, error?.response?.data?.message || error?.message || error)
        }
    }

    async eventSummary(req: NextApiRequest, res: NextApiResponse) {
        try {
            const payload = req.body
            const eventStart = dayjs(payload?.start).format('YYYY-MM-DDTHH:mm')
            const eventEnd = dayjs(payload?.end).format('YYYY-MM-DDTHH:mm')
            const eventKey = `${payload?.id}_${eventStart}_${eventEnd}_${payload?.meetingType}`

            const allZonesInGroup = await this.busGroupService.get()
            const zoneIds = allZonesInGroup.map(item => item._id)

            const busRoundPayload = {
                tag: eventKey
            }

            let records = this.service.exposeDocument(
                await this.service.get(busRoundPayload)
            ) as IBusRound[]

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
                } else if (item.busState === 'EN_ROUTE') {
                    busInfo.on_route += 1
                    peopleInfo.on_route += Number(item.people)
                }

                peopleInfo.people += Number(item.people)

                financeInfo.offering += Number(item.busOffering)
                financeInfo.cost += Number(item.busCost)

                nonActiveZones = nonActiveZones.filter(f => String(f) !== String(zoneId))

                if (item.people < 8) {
                    unMetTarget.push(item._id as string)
                }
            })

            return responses.successWithData(res, {
                busInfo,
                peopleInfo,
                financeInfo,
                allZones: zoneIds.length,
                nonActiveZones,
                unMetTarget
            })
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }
}

const BusRound = new BusRoundController(
    new BusRoundService(Bus),
    new BusGroupService(BusGroup),
    new EventService(Event)
);
export default BusRound
