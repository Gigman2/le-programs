import { Model } from 'mongoose';
import { IBusRound } from '@/interface/bus'
import BaseService from '../Base';

export default class BusRoundService extends BaseService<IBusRound>  {
    protected readonly name = 'BusRound';

    constructor(protected readonly model: Model<IBusRound>) {
        super(model)
    }
}