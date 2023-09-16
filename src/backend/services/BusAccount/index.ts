import { Model } from 'mongoose';
import { IBusAccount } from '@/interface/bus'
import BaseService from '../Base';

export default class BusAccountService extends BaseService<IBusAccount>  {
    protected readonly name = 'BusAccount';

    constructor(protected readonly model: Model<IBusAccount>) {
        super(model)
    }
}