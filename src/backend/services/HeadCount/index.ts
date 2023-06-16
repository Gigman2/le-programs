import { Model } from 'mongoose';
import BaseService from '../Base';
import { IHeadCount } from '@/interface/ushers';
import IHeadCountService from './interface';

export default class HeadCountService extends BaseService<IHeadCount> implements IHeadCountService {
    protected readonly name = 'HeadCount';

    constructor(protected readonly model: Model<IHeadCount>) {
        super(model)
    }
}