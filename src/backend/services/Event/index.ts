import { Model } from 'mongoose';
import BaseService from '../Base';
import { IEvent } from '@/interface/events';
import IEventService from './interface';

export default class EventService extends BaseService<IEvent> implements IEventService {
    protected readonly name = 'Event';

    constructor(protected readonly model: Model<IEvent>) {
        super(model)
    }
}