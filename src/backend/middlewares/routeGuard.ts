import redisCluster from "../lib/redis";
import Logger, { LogLevel } from "../config/logger";
import response from "../lib/response";
import { IUser } from "../interface/user.interface";
import { getSessionDataUsingAccessToken } from "../helpers/redis-helper";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const routeGuard = (shouldGuard: boolean) => (handler: NextApiHandler) => async (req: NextApiRequest & { user: IUser }, res: NextApiResponse) => {
    if (!shouldGuard) return handler(req, res);

    const authToken = req.headers['x-user-token'];

    if (!authToken) return response.unauthorized(res);

    const sessionData = await getSessionDataUsingAccessToken(authToken as string);
    console.log('User data ', sessionData);

    if (!sessionData) return response.unauthorized(res);

    req.user = sessionData.user_data as IUser;
    return handler(req, res);
}