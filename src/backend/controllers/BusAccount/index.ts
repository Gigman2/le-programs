import BusAccountService from '@/backend/services/BusAccount';
import BaseController from '../Base';
import { BusAccount as Account, BusGroup } from "@backend/models";
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'
import responses from '@/backend/lib/response';
import BusGroupService from '@/backend/services/BusGroup';
import { authAPI } from '@/backend/config/env';
import { AccountType } from "@/interface/bus";


class BusAccountController extends BaseController<BusAccountService> {
    protected name = 'BusAccount';
    constructor(service: BusAccountService, private busGroupService: BusGroupService) {
        super(service)
    }

    async login(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
            const { data: { data } } = await axios.post(`${authAPI}login`, req.body)

            if (data.user) {
                const accountId = data.user._id
                const busAccount = await this.service.getById(accountId)
                if (!busAccount) return responses.error(res, "It appears you don't have an account")
                data.account = busAccount
            }
            return responses.successWithData(res, data, "success")
        } catch (error: any) {
            return responses.error(res, error?.response?.data?.message || error?.message || error)
        }
    }

    async createUser(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
            const { data: userData } = await axios.get(`${authAPI}users?email=${req.body.email}`)
            let userId
            if (userData.statusCode !== 200) {
                const { data: { statusCode, data } } = await axios.post(`${authAPI}users`, { email: req.body.email, firstName: req.body.name })
                if (statusCode != 201 || !data?.firstName) return responses.error(res, "failed to create user")

                userId = data.data._id
            } else {
                userId = userData?.data?.[0]?._id
            }

            const newUser = await this.service.insert({
                "name": req.body.name,
                "_id": userData?.data?.[0]?._id,
                "addedGroup": req.body.group
            })

            return responses.successWithData(res, { data: newUser }, "success")
        } catch (error: any) {
            return responses.error(res, error?.response?.data?.message || error?.message || error)
        }
    }

    async addUserToGroup(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
            const payload = req.body
            const user = await this.service.getById(payload?.userId)
            const group = await this.busGroupService.getById(payload?.groupId)
            const userGroup: AccountType = { groupType: group?.type === "ZONE" ? "BUS_REP" : `${group?.type as 'BRANCH' | 'SECTOR'}_HEAD`, groupId: group?._id as string }
            const filterGroups: AccountType[] = (user?.accountType || []).filter(g => g.groupType != userGroup.groupType)
            const updatedAcc = await this.service.update(user?._id as string, { $set: { accountType: [...filterGroups, userGroup] } })
            return responses.successWithData(res, updatedAcc, "success")
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }

}

const getRoleForGroup = (groupType: "BRANCH" | "SECTOR"): 'BUS_REP' | 'BRANCH_HEAD' | 'SECTOR_HEAD' | 'OVERALL_HEAD' => {
    if (['BRANCH', 'SECTOR'].includes(groupType)) return `${groupType}_HEAD`
    else return 'BUS_REP'
}

const BusAccount = new BusAccountController(
    new BusAccountService(Account),
    new BusGroupService(BusGroup)
);
export default BusAccount
