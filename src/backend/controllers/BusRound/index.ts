import BusAccountService from '@/backend/services/BusAccount';
import BaseController from '../Base';
import BusRoundService from '@/backend/services/BusRound';
import { Bus, BusAccount } from "@backend/models";
import { NextApiRequest, NextApiResponse } from 'next';
import responses from '@/backend/lib/response';

class BusRoundController extends BaseController<BusRoundService> {
    protected name = 'BusGroup';
    constructor(service: BusRoundService, private busAccount: BusAccountService) {
        super(service)
    }
}

const BusRound = new BusRoundController(
    new BusRoundService(Bus),
    new BusAccountService(BusAccount)
);
export default BusRound
