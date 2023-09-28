import BusAccountService from '@/backend/services/BusAccount';
import BaseController from '../Base';
import { BusAccount as Account } from "@backend/models";

class BusAccountController extends BaseController<BusAccountService> {
    protected name = 'Bus account';
    constructor(service: BusAccountService) {
        super(service)
    }
}

const BusAccount = new BusAccountController(
    new BusAccountService(Account)
);
export default BusAccount
