import BaseController from '../Base';
import EventService from '@backend/services/Event';
import { Event } from '@backend/models';
import IEventController from './interface';

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
