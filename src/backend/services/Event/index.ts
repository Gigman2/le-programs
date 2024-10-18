import { Model } from 'mongoose';
import BaseService from '../Base';
import { IEvent } from '@/interface/events';
import BusGroupService from '../BusGroup';
import dayjs from 'dayjs';
import { MeetingTypes } from '@/helpers/misc';
import isBetween from 'dayjs/plugin/isBetween'
import Logger, { LogLevel } from '@/backend/config/logger';

export default class EventService extends BaseService<IEvent>  {
    protected readonly name = 'Event';
    logger = Logger.getInstance()

    constructor(protected readonly model: Model<IEvent>) {
        super(model)
    }

    async activeEvent(payload: { group: string }, busGroupService: BusGroupService) {
        dayjs.extend(isBetween)
        try {
            const tree = await busGroupService.getTree({ _id: this.objectId(payload.group) })
            const parents = tree?.map(item => item?.parent || null) || []
            const orderedParents = parents
                .map((item, i) => ({ id: String(item), order: Number(((parents.length - i) / parents.length).toFixed(2)) }))
                .reduce((acc: Record<string, number>, cValue) => {
                    const key = ![null, 'null'].includes(cValue.id) ? String(cValue.id) : '--'
                    acc[key] = cValue.order
                    return acc
                }, {})


            const allEventsInScope = this.exposeDocument<IEvent[]>(
                await this.get({ "scope.id": { '$in': parents } })
            )

            // Create a dictionary from meetingTypes
            let meetingTypesScore = MeetingTypes.reduce((acc: Record<string, number>, cValue) => {
                acc[cValue.tag] = cValue.score
                return acc
            }, {})

            const activeEvents = allEventsInScope
                // get meetings in range
                .filter(item => {
                    if (item.occurrence === 'FIXED') {
                        const eventDay = dayjs().isBetween((item.duration as { start: Date }).start, (item.duration as { end: Date }).end)
                        if (eventDay) return true
                    } else if (item.occurrence === 'RECURRING') {
                        const dayOfWeek = dayjs().day();
                        return item.meetingDays?.includes(dayOfWeek)
                    }
                })
                // score meetings
                .map((item) => {
                    const newItem = item as IEvent & { order: number }
                    let order = 0
                    const id = item?.scope?.id ? String(item.scope.id) : '--'
                    order = order + orderedParents[id] + meetingTypesScore[item.meetingType]
                    newItem.order = order
                    return newItem
                })

            let maxScoreEvent = null
            if (activeEvents.length) {
                maxScoreEvent = activeEvents.reduce(function (prev, current) {
                    return (prev && prev.order > current.order) ? prev : current
                })
            }
            return maxScoreEvent
        } catch (error) {
            this.logger.log('Error in activeEvent', LogLevel.Error, 'EVENT-SERVICE', error)
            return null
        }
    }
}