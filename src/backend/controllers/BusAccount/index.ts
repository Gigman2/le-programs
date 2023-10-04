import BusAccountService from '@/backend/services/BusAccount';
import BaseController from '../Base';
import { BusAccount as Account, BusGroup } from "@backend/models";
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'
import responses from '@/backend/lib/response';
import BusGroupService from '@/backend/services/BusGroup';
import { authAPI } from '@/backend/config/env';
import { AccountType, IBusAccount } from "@/interface/bus";
import AppCache from '@/backend/helpers/cache';


class BusAccountController extends BaseController<BusAccountService> {
    protected name = 'BusAccount';
    constructor(service: BusAccountService, private busGroupService: BusGroupService) {
        super(service)
        this.getAccount = this.getAccount.bind(this)

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
            let user
            if (!userData?.data?.length || [400, 422, 401, 403].includes(userData.statusCode)) {
                let [firstName, lastName] = req.body.name.split(' ')
                if (!lastName) lastName = '--'
                const { data: { statusCode, data } } = await axios.post(`${authAPI}users`,
                    { email: req.body.email, firstName: firstName, lastName: lastName }
                )
                if (statusCode != 201 || !data?.firstName) return responses.error(res, "failed to register user")

                user = data
            } else {
                user = userData?.data?.[0]
            }

            if (!user.accountCreated) {
                const { data: accountCreated } = await axios.post(`${authAPI}users/create-account`,
                    { id: user._id, role: "Bus Coordinator" }
                )
                if (!accountCreated.data.accountCreated) return responses.error(res, "failed to create user account")
            }

            let savedUser = await this.service.getById(user._id)

            if (!savedUser) {
                await this.service.insert(
                    {
                        "name": req.body.name,
                        "_id": user._id,
                        "addedGroup": req.body.group
                    })
            }

            return responses.successWithData(res, { data: savedUser }, "success")
        } catch (error: any) {
            return responses.error(res, error?.response?.data?.message || error?.message || error)
        }
    }

    async addUserToGroup(req: NextApiRequest, res: NextApiResponse<any>) {
        const typeToRole = {
            ZONE: "BUS_REP",
            BRANCH: "BUS_HEAD",
            SECTOR: "SECTOR_HEAD",
            OVERALL: "OVERALL_HEAD"
        }
        try {
            const payload = req.body
            const user = await this.service.getById(payload?.userId)
            const group = await this.busGroupService.getById(payload?.groupId)
            const userGroup: AccountType = {
                groupType: typeToRole[group?.type as 'ZONE' | 'BRANCH' | 'SECTOR' | 'OVERALL'] as any,
                groupId: group?._id as string
            }

            const filterGroups: AccountType[] = (user?.accountType || []).filter(g => g.groupType != userGroup.groupType)
            const updatedAcc = await this.service.update(user?._id as string, { $set: { accountType: [...filterGroups, userGroup] } })
            return responses.successWithData(res, updatedAcc, "success")
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }

    async getAccount(req: NextApiRequest, res: NextApiResponse) {
        try {
            const data = this.service.exposeDocument<IBusAccount[]>(
                await this.service.get({ ...req.body, status: { "$ne": "ARCHIVED" } })
            )
            if (data.length) {
                const ids = Array.from(new Set([...data.map(f => f._id).filter(Boolean)]))
                const users = await this.service.getUsers(ids as string[], req.headers.authorization as string, true)
                data.map((item) => {
                    item.account = users[item?._id as string]
                })
            }
            return responses.successWithData(res, data, "success")
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }

    async testCache(req: NextApiRequest, res: NextApiResponse) {
        try {
            const Auth = req.headers.authorization
            const { email } = req.query
            const userData = await this.service.getUser(email as string, Auth as string)
            return responses.successWithData(res, userData, "success")
        } catch (error: any) {
            return responses.error(res, error.message || error)
        }
    }
}

const BusAccount = new BusAccountController(
    new BusAccountService(Account),
    new BusGroupService(BusGroup)
);
export default BusAccount
