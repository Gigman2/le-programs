import { Bus } from '@/backend/models';
import BaseController from '../Base';
import IBusRoundController from './interface';
import BusRoundService from '@/backend/services/BusRound';

class BusRoundController extends BaseController<BusRoundService> implements IBusRoundController {
    protected name = 'BusGroup';
    constructor(service: BusRoundService) {
        super(service)
    }
}

const BusRound = new BusRoundController(
    new BusRoundService(Bus)
);
export default BusRound
