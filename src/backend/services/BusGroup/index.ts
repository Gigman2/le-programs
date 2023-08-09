import { Model } from 'mongoose';
import { IBusGroups } from '@/interface/bus'
import BaseService from '../Base';

export default class BusGroupService extends BaseService<IBusGroups> {
    protected readonly name = 'BusGroup';

    constructor(protected readonly model: Model<IBusGroups>) {
        super(model)
    }
}