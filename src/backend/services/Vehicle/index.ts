import { Model } from 'mongoose';
import { IVehicle } from '@/interface/vehicle';
import BaseService from '../Base';

export default class VehicleService extends BaseService<IVehicle>  {
    protected readonly name = 'Vehicle';

    constructor(protected readonly model: Model<IVehicle>) {
        super(model)
    }
}