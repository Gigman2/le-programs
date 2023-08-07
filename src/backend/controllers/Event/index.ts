import BaseController from '../Base';
import EventService from '@backend/services/Event';
import {Event } from '@backend/models';

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
