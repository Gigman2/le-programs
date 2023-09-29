import BaseController from '../Base';
import EventService from '@backend/services/Event';
import { BusGroup, Event } from '@backend/models';
import IEventController from './interface';
import { NextApiRequest, NextApiResponse } from 'next';
import BusGroupService from '@/backend/services/BusGroup';
import responses from '@/backend/lib/response';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

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
            const parents = tree?.map(item => item?.parent || null)

            const allEventsInScope = await this.service.get({ "scope.id": { '$in': parents } })
            allEventsInScope.filter(item => {
                if (item.occurrence === 'FIXED') {
                    const eventDay = dayjs().isBetween((item.duration as { start: Date }).start, (item.duration as { end: Date }).end)
                    if (eventDay) return true
                } else if (item.occurrence === 'RECURRING') {

                }
            })
            return responses.successWithData(res, null)
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
