import { Model } from 'mongoose';
import BaseService from '../Base';
import { IHeadCount } from '@/interface/ushers';

export default class HeadCountService extends BaseService<IHeadCount> {
    protected readonly name = 'HeadCount';

    constructor(protected readonly model: Model<IHeadCount>) {
        super(model)
    }
}