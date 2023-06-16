import { Model } from 'mongoose';
import { IBusRound } from '@/interface/bus'
import IBusRoundService from './interface'

import BaseService from '../Base';

export default class BusRoundService extends BaseService<IBusRound> implements IBusRoundService {
    protected readonly name = 'BusRound';

    constructor(protected readonly model: Model<IBusRound>) {
        super(model)
    }
}