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
import { ObjectId } from 'mongodb';
import Logger, { LogLevel } from '@/backend/config/logger';
import redisInstance from '@/backend/lib/redis';
import { IUser } from '@/interface/misc';
class BusRoundController extends BaseController<BusRoundService> {
    protected name = 'BusGroup';
    private logger = Logger.getInstance()
    private redis = redisInstance.getInstance()
    constructor(service: BusRoundService, private busGroupService: BusGroupService, private eventService: EventService,) {
        super(service)
    }

    async busBranchSummary(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
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

            const summary = await this.service.summaryData(records, zoneIds)

            let groupedByZone: Record<string, IBusRound[]> = {}
            let groupedByZoneName: Record<string, IBusRound[]> = {}


            records = await Promise.all(
                records.map(async item => {
                    const addedBy = (item.recordedBy as unknown as { _id: string })?._id || item.recordedBy
                    const key = addedBy + '_cached_user'
                    const user = await this.redis.get(key) as IUser || null
                    if (user) {
                        item.addedBy = user
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
                ...summary,
                notStarted: summary.nonActiveZones,
                zones: groupedByZoneName,
            })
        } catch (error: any) {
            this.logger.log('Unable to get bus round summary', LogLevel.Error, 'BUS_ROUND_SUMMARY', error)
            return responses.error(res, error?.response?.data?.message || error?.message || error)
        }
    }

    async eventSummary(req: NextApiRequest, res: NextApiResponse) {
        try {
            const payload = req.body
            const eventStart = dayjs(payload?.start).format('YYYY-MM-DDTHH:mm')
            const eventEnd = dayjs(payload?.end).format('YYYY-MM-DDTHH:mm')
            const eventKey = `${payload?.id}_${eventStart}_${eventEnd}_${payload?.meetingType}`

            const allZonesInGroup = await this.busGroupService.get({ status: "ACTIVE" })
            const zoneIds = allZonesInGroup.map(item => item._id)

            const busRoundPayload = {
                tag: eventKey
            }

            let records = this.service.exposeDocument(
                await this.service.get(busRoundPayload)
            ) as IBusRound[]

            const summary = await this.service.summaryData(records, zoneIds)

            return responses.successWithData(res, {
                ...summary,
                allZones: zoneIds,
            })
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }

    async overallSummary(req: NextApiRequest, res: NextApiResponse) {
        try {
            const payload = req.body
            const eventStart = dayjs(payload?.start).format('YYYY-MM-DDTHH:mm')
            const eventEnd = dayjs(payload?.end).format('YYYY-MM-DDTHH:mm')
            const eventKey = `${payload?.id}_${eventStart}_${eventEnd}_${payload?.meetingType}`

            const allZonesInGroup = await this.busGroupService.get({ type: "ZONE" })
            const structuredZone = allZonesInGroup.reduce((acc: Record<string, { parent: string }>, cValue) => {
                if (!acc[cValue._id]) acc[cValue._id] = { parent: cValue.parent as string }
                return acc
            }, {})

            const busRoundPayload = {
                tag: eventKey
            }

            let records = this.service.exposeDocument(
                await this.service.get(busRoundPayload)
            ) as IBusRound[]

            interface IStructuredRecord extends IBusRound {
                zoneParent: string
            }

            const structuredZoneRecord = (records as unknown as IStructuredRecord[]).map(item => {
                if (item.busZone) {
                    item.zoneParent = structuredZone[(item.busZone as unknown as { _id: string })?._id]?.parent

                    delete item.event
                    delete item.stopPoints
                    delete item.addedBy
                    delete item.recordedBy
                    delete item.created_on
                    delete item.updated_on
                    delete item.busZone

                    return item
                }
            })

            const groupedByBranch = structuredZoneRecord.reduce((acc: Record<string, any>, cValue) => {
                if (!cValue) {
                    return acc
                }


                if (!acc[cValue?.zoneParent]) acc[cValue?.zoneParent] = {}

                const item = {
                    total: (acc[cValue?.zoneParent]?.total || 0) + 1,
                    offering: (acc[cValue?.zoneParent]?.offering || 0) + cValue.busOffering,
                    cost: (acc[cValue?.zoneParent]?.cost || 0) + cValue.busCost
                }
                acc[cValue?.zoneParent] = item
                return acc

            }, {})

            const branchParentIds = Object.keys(groupedByBranch)
            const branchParents = this.service.exposeDocument<IBusGroups[]>(
                await this.busGroupService.get({ _id: { $in: branchParentIds } })
            )

            interface IStructuredBranch extends IBusGroups {
                subData: any
            }
            const branchData = (branchParents as IStructuredBranch[]).map(item => {
                let newItem: {
                    name?: string,
                    parent?: string | ObjectId,
                    subData?: { total: number, offering: number; cost: number }
                } = {}

                if (!item) { return newItem }
                newItem = {
                    name: item.name,
                    parent: item.parent,
                    subData: groupedByBranch[item._id as string]
                }

                return newItem
            })

            const groupedBySector = branchData.reduce((acc: Record<string, any>, cValue) => {
                if (!acc[cValue?.parent as string]) acc[cValue?.parent as string] = {}

                const item = {
                    branches: [...(acc[cValue?.parent as string].branches || []), cValue.name],
                    total: (acc[cValue?.parent as string]?.total || 0) + (cValue?.subData?.total || 0),
                    offering: (acc[cValue?.parent as string]?.offering || 0) + (cValue?.subData?.offering || 0),
                    cost: (acc[cValue?.parent as string]?.cost || 0) + (cValue?.subData?.cost || 0)
                }
                acc[cValue?.parent as string] = item
                return acc
            }, {})

            const sectors = this.service.exposeDocument<IBusGroups[]>(
                await this.busGroupService.get({ type: "SECTOR" })
            )
            const finalData = await Promise.all(
                sectors.map(async item => {
                    const group = groupedBySector[item?._id as string]
                    const children = await this.busGroupService.get({ parent: item?._id })
                    const unBused = children.map(k => k.name).filter(k => !(group?.branches || []).includes(k as string))
                    if (group) {
                        group.unBused = unBused
                    }
                    return { ...item, ...group }
                })
            )

            return responses.successWithData(res, finalData)
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }

    async overallSectorSummary(req: NextApiRequest, res: NextApiResponse) {
        try {
            const payload = req.body
            const eventStart = dayjs(payload?.start).format('YYYY-MM-DDTHH:mm')
            const eventEnd = dayjs(payload?.end).format('YYYY-MM-DDTHH:mm')
            const eventKey = `${payload?.id}_${eventStart}_${eventEnd}_${payload?.meetingType}`


            const getAllChildren = await this.busGroupService.getChildren(payload.group, 'ZONE')

            const busRoundPayload = {
                busZone: { '$in': getAllChildren },
                tag: eventKey
            }


            let records = this.service.exposeDocument(
                await this.service.get(busRoundPayload)
            ) as IBusRound[]

            const summary = await this.service.summaryData(records, getAllChildren as string[])


            return responses.successWithData(res, {
                ...summary,
                notStarted: summary.nonActiveZones
            })
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }

    async sectorSummary(req: NextApiRequest, res: NextApiResponse) {
        try {
            const payload = req.body
            const eventStart = dayjs(payload?.start).format('YYYY-MM-DDTHH:mm')
            const eventEnd = dayjs(payload?.end).format('YYYY-MM-DDTHH:mm')
            const eventKey = `${payload?.id}_${eventStart}_${eventEnd}_${payload?.meetingType}`


            let branches = this.service.exposeDocument<IBusGroups[]>(
                await this.busGroupService.get({
                    parent: payload.group
                })
            ).map(item => ({
                name: item.name,
                id: item._id,
                zones: [] as string[] | undefined,
                children: [] as any[],
                records: {} as any
            }))

            const branchIds = branches.map(item => item.id)
            const zones = this.service.exposeDocument<IBusGroups[]>(
                await this.busGroupService.get({
                    parent: { '$in': branchIds }
                })
            ).map(item => ({ name: item.name, id: item._id, parent: item.parent }))

            branches = branches.map(item => {
                item.zones = zones.filter(k => k.parent === item.id).map(item => item.id as string)
                item.children = zones.filter(k => k.parent === item.id)
                return item
            })

            branches = await Promise.all(
                branches.map(async item => {
                    const busRoundPayload = {
                        busZone: { '$in': item.zones },
                        tag: eventKey
                    }
                    const records = this.service.exposeDocument<IBusRound[]>(
                        await this.service.get(busRoundPayload)
                    ).map(item => {
                        return {
                            people: item.people,
                            busState: item.busState,
                            busCost: item.busCost,
                            offering: item.busOffering,
                            zone: (item.busZone as unknown as { _id: string })._id
                        }
                    })

                    item.children.map(c => {
                        const isRecord = records.find(f => f.zone === c.id)
                        c.bused = !!isRecord
                        return c
                    })

                    const reducedRecords = records.reduce((acc, cValue) => {
                        acc.people += cValue.people
                        acc.offering += cValue.offering
                        acc.cost += cValue.busCost
                        if (cValue.busState === 'ARRIVED') {
                            acc.busArrived += 1
                            acc.peopleArrived += cValue.people
                        } else {
                            acc.busInRoute += 1
                            acc.peopleInRoute += cValue.people
                        }
                        return acc
                    }, {
                        people: 0,
                        offering: 0,
                        cost: 0,
                        peopleArrived: 0,
                        peopleInRoute: 0,
                        busArrived: 0,
                        busInRoute: 0
                    })

                    delete item.zones
                    item.records = reducedRecords

                    return item
                })
            )

            return responses.successWithData(res, branches)
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
