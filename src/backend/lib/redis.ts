import * as redis from 'redis';
import { appDebugger } from './../config/logger';
import type { RedisClientType } from 'redis';
import { redisHost, redisPass, redisPort } from '../config/env';

interface IAppRedisClient {
    Client: RedisClientType | null;

    initializeAsync({ host, port, password }: { host: string; port: string; password: string }): Promise<void>;
}

class AppRedisClient implements IAppRedisClient {
    private static instance: AppRedisClient | null = null;
    Client: RedisClientType | null;

    private constructor() {
        this.Client = null;
    }

    static getInstance(): AppRedisClient {
        if (!this.instance) {
            this.instance = new AppRedisClient();
        }
        return this.instance;
    }

    async initializeAsync({ host, port, password }: { host: string; port: string; password: string }): Promise<void> {
        if (!this.Client) {
            const url = `redis://${host}:${port}`;
            this.Client = redis.createClient({ url: url });
            await this.Client.connect();
            await this.Client.auth({ password });

            this.Client.on('connect', () => {
                console.log('Redis connected');
                appDebugger(`Connected to redis on ${host}`);
            });

            this.Client.on('error', (err) => {
                appDebugger(`Redis server stopped because ${err}`);
            });

        }
    }
}

export default AppRedisClient;
