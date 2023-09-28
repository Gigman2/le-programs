import BaseController from '../Base';
import VehicleService from '@/backend/services/Vehicle';
import {Vehicle} from "@backend/models";

class VehicleController extends BaseController<VehicleService> {
    protected name = 'Vehicle';
    constructor(service:VehicleService) {
        super(service)
    }
}

const ChuchVehicle = new VehicleController(
    new VehicleService(Vehicle)
);
export default ChuchVehicle