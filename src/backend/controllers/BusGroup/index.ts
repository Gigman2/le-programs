import BusGroupService from '@/backend/services/BusGroup';
import { Group } from '@/backend/models';
import BaseController from '../Base';
import IBusGroupController from './interface';

class BusGroupController extends BaseController<BusGroupService> implements IBusGroupController {
    protected name = 'BusGroup';
    constructor(service: BusGroupService) {
        super(service)
    }
}

const BusGroup = new BusGroupController(
    new BusGroupService(Group)
);
export default BusGroup
