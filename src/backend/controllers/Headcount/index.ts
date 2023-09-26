import { Event, HeadCount } from '@/backend/models';
import BaseController from '../Base';
import HeadCountService from '@/backend/services/HeadCount';
import IHeadCountController from './interface';

class HeadCountController extends BaseController<HeadCountService> implements IHeadCountController {
    protected name = 'BusGroup';
    constructor(service: HeadCountService) {
        super(service)
    }
}

const ChurchHeadCount = new HeadCountController(
    new HeadCountService(HeadCount)
);
export default ChurchHeadCount
