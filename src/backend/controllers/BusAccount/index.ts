import BusAccountService from '@/backend/services/BusAccount';
import BaseController from '../Base';
import { BusAccount as Account, BusGroup } from "@backend/models";
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'
import responses from '@/backend/lib/response';
import BusGroupService from '@/backend/services/BusGroup';
import { authAPI } from '@/backend/config/env';


class BusAccountController extends BaseController<BusAccountService> {
    protected name = 'BusAccount';

    constructor(service: BusAccountService, private busGroupService: BusGroupService) {
        super(service)
    }


    async createUser(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
            const { data: { statusCode, data } } = await axios.post(`${authAPI}users`, req.body)
            if (statusCode != 201 || !data?.firstName) return responses.error(res, "failed to create user")
            const newUser = await this.service.insert({
                "name": data.firstName,
                "_id": data._id
            })

            return responses.successWithData(res, { data: newUser }, "success")
        } catch (error: any) {
            console.log(error)
            return responses.error(res, error.message || error)
        }
    }

    async addUserToGroup(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
            const payload = req.body
            const data = await this.busGroupService.getById(payload?.groupId)

        } catch (error: any) {
            console.log(error)
            return responses.error(res, error.message || error)
        }
    }

}

const BusAccount = new BusAccountController(
    new BusAccountService(Account),
    new BusGroupService(BusGroup)
);
export default BusAccount
