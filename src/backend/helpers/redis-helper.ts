import ms from "ms";
import redisCluster from "../lib/redis";
import { IUser } from "../interface/user.interface";



const redis = redisCluster.getInstance()

export const storeSessionWithRefreshToken = async (
    refreshToken: string,
    accessToken: string,
    userData: IUser,
    ttl: string,
    accessTtL: string
) => {
    const expirationDuration = ms(ttl)
    const expiresOn = new Date().getTime() + expirationDuration

    await redis.setHashMap(`refresh-token:${refreshToken}`, {
        "access_token": accessToken,
        "user_data": userData,
        "expires_on": expiresOn
    });

    await storeAccessToken(accessToken, refreshToken, accessTtL)
};

export const getSessionDataUsingAccessToken = async (accessToken: string) => {
    const refreshToken = await redis.get(`access-token:${accessToken}`);
    if (refreshToken) {
        return redis.getAllDataFromHashMap(`refresh-token:${refreshToken}`);
    }
    return null;
};


// Store access token with reference to refresh token
export const storeAccessToken = async (accessToken: string, refreshToken: string, ttl: string) => {
    await redis.set(`access-token:${accessToken}`, refreshToken, ttl);
};
