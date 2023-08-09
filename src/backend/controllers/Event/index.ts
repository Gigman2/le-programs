import { Event } from '@/backend/models';
import BaseController from '../Base';
import IEventController from './interface';
import EventService from '@/backend/services/Event';

class EventController extends BaseController<EventService> implements IEventController {
    protected name = 'Event';
    constructor(service: EventService) {
        super(service)
    }
}

const ChurchEvent = new EventController(
    new EventService(Event)
);
export default ChurchEvent
