import redisCluster from "../lib/redis";
import Logger, { LogLevel } from "../config/logger";
import response from "../lib/response";
import { IUser } from "../interface/user.interface";
import { getSessionDataUsingAccessToken } from "../helpers/redis-helper";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import redisInstance from "../lib/redis";

export const routeGuard = (shouldGuard: boolean) => (handler: NextApiHandler) => async (req: NextApiRequest & { user: IUser }, res: NextApiResponse) => {
    const logger = Logger.getInstance();
    logger.log('Initializing Redis', LogLevel.Info, 'ROUTE-GUARD');
    redisInstance.getInstance(); // Initialize Redis before anything else

    if (!shouldGuard) return handler(req, res);

    const authToken = req.headers['x-user-token'];
    if (!authToken) {
        logger.log('Unauthorized access attempt - No token provided', LogLevel.Error, 'ROUTE-GUARD');
        return response.unauthorized(res);
    }

    const sessionData = await getSessionDataUsingAccessToken(authToken as string);

    if (!sessionData) {
        logger.log('Unauthorized access attempt - User data not found in redis', LogLevel.Error, 'ROUTE-GUARD');
        return response.unauthorized(res);
    }

    req.user = sessionData.user_data as IUser;
    return handler(req, res);
}