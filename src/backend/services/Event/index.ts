import { Model } from 'mongoose';
import BaseService from '../Base';
import { IEvent } from '@/interface/events';

export default class EventService extends BaseService<IEvent>  {
    protected readonly name = 'Event';

    constructor(protected readonly model: Model<IEvent>) {
        super(model)
    }
}