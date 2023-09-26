import { Model } from 'mongoose';
import { IBusGroups } from '@/interface/bus'
import IBusGroupService from './interface'

import BaseService from '../Base';

export default class BusGroupService extends BaseService<IBusGroups> implements IBusGroupService {
    protected readonly name = 'BusGroup';

    constructor(protected readonly model: Model<IBusGroups>) {
        super(model)
    }
}