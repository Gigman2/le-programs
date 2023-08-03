import { Event } from '@/backend/models';
import BaseController from '../Base';
import EventService from '@backend/services/Event';

class EventController extends BaseController<EventService> {
    protected name = 'BusGroup';
    constructor(service: EventService) {
        super(service)
    }
}

const ChurchEvent = new EventController(
    new EventService(Event)
);
export default ChurchEvent
