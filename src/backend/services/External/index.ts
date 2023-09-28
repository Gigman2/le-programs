import { Model } from 'mongoose';
import BaseService from '../Base';

export default class ExternalService extends BaseService<any>  {
    protected readonly name = 'AuthUser';

    constructor(protected readonly model: Model<any>) {
        super(model)
    }

}