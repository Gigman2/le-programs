import BaseController from '../Base';
import EventService from '@backend/services/Event';
import { BusGroup, Event } from '@backend/models';
import IEventController from './interface';
import { NextApiRequest, NextApiResponse } from 'next';
import BusGroupService from '@/backend/services/BusGroup';
import responses from '@/backend/lib/response';

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
}

const ChurchEvent = new EventController(
    new EventService(Event),
    new BusGroupService(BusGroup)
);

export default ChurchEvent
