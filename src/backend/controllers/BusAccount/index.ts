import BusAccountService from '@/backend/services/BusAccount';
import BaseController from '../Base';
import { Bus } from "@backend/models";

class BusAccountController extends BaseController<BusAccountService> {
    protected name = 'BusGroup';
    constructor(service: BusAccountService) {
        super(service)
    }
}

const BusAccount = new BusAccountController(
    new BusAccountService(Bus)
);
export default BusAccount
