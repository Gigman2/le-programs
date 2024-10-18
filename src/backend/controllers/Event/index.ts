import BaseController from '../Base';
import EventService from '@backend/services/Event';
import { BusGroup, Event } from '@backend/models';
import IEventController from './interface';
import { NextApiRequest, NextApiResponse } from 'next';
import BusGroupService from '@/backend/services/BusGroup';
import responses from '@/backend/lib/response';
import { IEvent } from '@/interface/events';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'

class EventController extends BaseController<EventService> implements IEventController {
    protected name = 'Event';
    constructor(service: EventService, private busGroupService: BusGroupService) {
        super(service)
    }

    async activeEvent(req: NextApiRequest, res: NextApiResponse) {
        try {
            const payload = req.body
            const activeEvent = await this.service.activeEvent(payload, this.busGroupService)
            return responses.successWithData(res, activeEvent)
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }

    async getPreviousEvents(req: NextApiRequest, res: NextApiResponse) {
        dayjs.extend(relativeTime)
        dayjs.extend(isBetween)

        try {
            const allEvents = this.service.exposeDocument<IEvent[]>(
                await this.service.get({ status: "ACTIVE" })
            )

            const dates: any[] = []
            const endOfWeek = dayjs().endOf('w')
            await Promise.all(
                allEvents
                    .filter(item => {
                        if (item.occurrence === 'FIXED') {
                            const eventDay = dayjs((item.duration as { end: Date }).end).isBetween((item.duration as { start: Date }).start, endOfWeek)
                            return eventDay
                        }
                        return true
                    })
                    .map(item => {
                        if (item.duration) {
                            dates.push({
                                id: item._id,
                                name: item.name,
                                start: dayjs(item.duration.start).format('YYYY-MM-DDTHH:mm'),
                                end: dayjs(item.duration.end).format('YYYY-MM-DDTHH:mm'),
                                timeSince: dayjs(item.duration.end).fromNow(),
                                live: dayjs().isBetween(item.duration.start, item.duration.end),
                                daysTo: dayjs().diff(item.duration.start, 'day'),
                                meetingType: item.meetingType
                            })
                        } else {
                            item.meetingDays?.map(m => {
                                const start = dayjs().day(m).startOf('day');
                                const end = dayjs().day(m).endOf('day');
                                dates.push({
                                    id: item._id,
                                    name: item.name,
                                    start: start.format('YYYY-MM-DDTHH:mm'),
                                    end: end.format('YYYY-MM-DDTHH:mm'),
                                    timeSince: start.fromNow(),
                                    live: dayjs().isBetween(
                                        start,
                                        end
                                    ),
                                    daysTo: dayjs().diff(start, 'day'),
                                    meetingType: item.meetingType
                                })
                            })
                        }
                    })
            )

            dates.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

            return responses.successWithData(res, dates.slice(0, 4))
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
