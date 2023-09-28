import BaseController from '../Base';
import ExternalService from "@backend/services/External";
import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import response from "@backend/lib/response";
import {models} from "mongoose";

const liveUrl = "https://le-auth-api.onrender.com"



const createBusAccount = async (req: any) => {
    try {
        return await axios.post(`${liveUrl}/api/bus-accounts`, req)
    } catch (error: any) {
        console.log(error)
    }
    return null;
}


const getGroupDetails = async (groupId: string)=>{
    try {
        return await axios.get(`${liveUrl}/api/bus-groups/${groupId}`)
    }catch (error: any){
        console.log(error)
    }
    return null;

}


class ExternalController extends BaseController<ExternalService> {
    protected name = 'External User';

    constructor(service: ExternalService) {
        super(service)
    }

    async createUser(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
            const {data: {statusCode, data}} = await axios.post(`${liveUrl}/api/v1/users`, req.body)
            if (statusCode != 201 || !data?.firstName) return response.error(res, "failed to create user")
            const {data: {statusCode: _statusCode}} = await createBusAccount({
                "name": data.firstName,
                "_id": data._id
            })
            if (_statusCode != 201) {
                // TODO delete user
                return response.error(res, "failed to create bus account")
            }
            return response.success(res, "success")
        } catch (error: any) {
            console.log(error)
            return response.error(res, error.message || error)
        }
    }


    async addUserToGroup(req: NextApiRequest, res: NextApiResponse<any>) {
        try {
        const data = await getGroupDetails(req.body?.groupId)

        } catch (error: any) {
            console.log(error)
            return response.error(res, error.message || error)
        }
    }
}


const External = new ExternalController(
    new ExternalService(models.External)
);
export default External
