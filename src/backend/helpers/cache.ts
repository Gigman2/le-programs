import { getLogger } from "../config/logger";
import RedisClient from '@backend/lib/redis'
import util from 'util'
import { redisHost, redisPass, redisPort } from "../config/env";

class AppCache {
    protected name = 'AppCache';
    cluster: any;

    async insertData(key: string, data: any, time = 22400) {
        try {
            if (typeof key !== 'string') {
                key = JSON.stringify(key)
            }
            this.cluster.initializeAsync({
                host: redisHost,
                port: redisPort,
                password: redisPass,
            });

            const redisKey = key
            this.cluster.Client.setex(redisKey, time, JSON.stringify(data))

            return true
        } catch (e) {
            getLogger().error(e)
            return false
        }
    }

    async getCachedData(key: any) {
        try {
            const redisClient = RedisClient.getInstance();
            if (typeof key !== 'string') {
                key = JSON.stringify(key)
            }

            await redisClient.initializeAsync({
                host: redisHost as string,
                port: redisPort as string,
                password: redisPass as string,
            });

            if (redisClient.Client) {
                const Client = redisClient.Client
                const getAsync = util.promisify(Client.get).bind(Client)
                const data = await getAsync(key)

                return data
            }
            getLogger().warn('Failed to get instance of redis client')
            return null
        } catch (e) {
            getLogger().error(e)
            return null
        }
    }

    async delCachedData(key: any) {
        try {
            if (typeof key !== 'string') {
                key = JSON.stringify(key)
            }
            const Client = this.cluster
            const delAsync = util.promisify(Client.del).bind(Client)
            await delAsync(key)
            return true
        } catch (e) {
            getLogger().error(e)
            return false
        }
    }
}

export default AppCache