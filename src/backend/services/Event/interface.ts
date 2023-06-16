import { Model } from 'mongoose';
import BaseService from '../Base';
import { IEvent } from '@/interface/events';

export default interface IEventService extends BaseService<IEvent> {
}