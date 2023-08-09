import BaseController from '../Base';
import BusRoundService from '@/backend/services/BusRound';
import {Bus} from "@backend/models";

class BusRoundController extends BaseController<BusRoundService> {
    protected name = 'BusGroup';
    constructor(service: BusRoundService) {
        super(service)
    }
}

const BusRound = new BusRoundController(
    new BusRoundService(Bus)
);
export default BusRound
