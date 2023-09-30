import BaseController from '../Base';
import EventService from '@backend/services/Event';
import { BusGroup, Event } from '@backend/models';
import IEventController from './interface';
import { NextApiRequest, NextApiResponse } from 'next';
import BusGroupService from '@/backend/services/BusGroup';
import responses from '@/backend/lib/response';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { Types } from 'mongoose';
import { IEvent } from '@/interface/events';
import { MeetingTypes } from '@/helpers/misc';

class EventController extends BaseController<EventService> implements IEventController {
    protected name = 'Event';
    constructor(service: EventService, private busGroupService: BusGroupService) {
        super(service)
    }

    async activeEvent(req: NextApiRequest, res: NextApiResponse) {
        dayjs.extend(isBetween)
        try {
            const payload = req.body
            const tree = await this.busGroupService.getTree({ _id: this.objectId(payload.group) })
            const parents = tree?.map(item => item?.parent || null) || []
            const orderedParents = parents
                .map((item, i) => ({ id: String(item), order: Number(((parents.length - i) / parents.length).toFixed(2)) }))
                .reduce((acc: Record<string, number>, cValue) => {
                    const key = ![null, 'null'].includes(cValue.id) ? String(cValue.id) : '--'
                    acc[key] = cValue.order
                    return acc
                }, {})


            const allEventsInScope = this.service.exposeDocument<IEvent[]>(
                await this.service.get({ "scope.id": { '$in': parents } })
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



            return responses.successWithData(res, maxScoreEvent)
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }
}

const ChurchEvent = new EventController(
    new EventService(Event),
    new BusGroupService(BusGroup)
);

export default ChurchEvent
