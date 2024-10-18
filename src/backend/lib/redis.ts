import * as redis from 'redis';
import type { RedisClientType } from 'redis';
import { formatBytes, isStringifiedObject } from '../helpers/misc';
import { appDebugger } from '../utils/logger';
import Logger, { LogLevel } from '../config/logger';
import ms from 'ms';
import {redisHost, redisPort, redisPass} from '@backend/config/env'

interface IAppRedisClient {
    Client: RedisClientType | null;
    initializeAsync({ host, port, password }: { host: string; port: string; password: string }): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, expiry?: string): Promise<boolean>;
    remove(...args: string[]): Promise<number | null>;
    setHashMap(key: string, payload: Record<string, any>): Promise<boolean>;
    getSingleDataFromHashMap(key: string, field: string): Promise<any>;
    getAllDataFromHashMap(key: string): Promise<any>;
}

class AppRedisClient implements IAppRedisClient {
    private static instance: AppRedisClient | null = null;
    Client: RedisClientType | null;
    logger = Logger.getInstance()
    defaultExpiry = '1h'
    private constructor() {
        this.Client = null;
    }

    static getInstance(): AppRedisClient {
        if (!this.instance) {
            this.instance = new AppRedisClient();
            this.instance.initializeAsync({host: redisHost as string, port: redisPort as string, password: redisPass as string})
        }
        return this.instance;
    }

    async initializeAsync({ host, port, password }: { host: string; port: string; password: string }): Promise<void> {
        if (!this.Client) {
            const url = `redis://${host}:${port}`;
            console.log(`Redis => `, url);
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

    get = async <T>(key: string): Promise<T | null> => {
        const data = await this.Client?.get(key)
        if (!data) {
            this.logger.log(`No Data found: Key ${key}`, LogLevel.Info, "REDIS-CACHE");
            return null
        }
        const dataSize = Buffer.byteLength(data, 'utf8');
        this.logger.log(`Data retrieved : Key ${key} : Size ${formatBytes(dataSize)}`, LogLevel.Info, "REDIS-CACHE");
        if (isStringifiedObject(data)) return JSON.parse(data) as T
        return data as T
    }

    set = async (key: string, value: string, expiry?: string) => {
        try {
            if (typeof key !== 'string') {
                key = String(key)
            }

            if (typeof value !== 'string') {
                value = JSON.stringify(value)
            }
            const dataSize = Buffer.byteLength(value, 'utf8');

            const expirationString = expiry || this.defaultExpiry
            const expiresIn = ms(expirationString)
            await this.Client?.set(key, value, { EX: expiresIn })
            this.logger.log(`Data cached : Key ${key} : Size ${formatBytes(dataSize)} : Duration ${expirationString}`, LogLevel.Info, "REDIS-CACHE");
            return true
        } catch (error) {
            this.logger.log(`Unable to cache data`, LogLevel.Error, "REDIS-CACHE", error);
            return false
        }
    }

    remove = async (...args: string[]) => {
        try {
            let keys = args
            const newKeys = keys.map(key => {
                if (typeof key !== 'string') {
                    key = JSON.stringify(key)
                }
                return key
            })
            await this.Client?.del(newKeys)
            return newKeys.length
        } catch (error) {
            this.logger.log(`Unable to delete data`, LogLevel.Error, "REDIS-CACHE", error);
            return null
        }
    }

    setHashMap = async (key: string, payload: Record<string, any>): Promise<boolean> => {
        try {
            if (typeof key !== 'string') {
                key = String(key)
            }
            for (const k in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, k)) {
                    let value = payload[k]
                    if (typeof value !== 'string') {
                        value = JSON.stringify(value)
                    }
                    await this.Client?.hSet(key, k, value)
                }
            }
            this.logger.log(`Data cached  in hash map : Key ${key} `, LogLevel.Info, "REDIS-CACHE");
            return true
        } catch (error) {
            this.logger.log(`Unable to cache data in hash map`, LogLevel.Error, "REDIS-CACHE", error);
            return false
        }
    }

    getSingleDataFromHashMap = async (key: string, field: string): Promise<any> => {
        try {
            return await this.Client?.hGet(key, field)
        } catch (error) {
            this.logger.log(`Unable to get data from hash map`, LogLevel.Error, "REDIS-CACHE", error);
        }
    }

    getAllDataFromHashMap = async (key: string): Promise<any> => {
        try {
            return await this.Client?.hGetAll(key)
        } catch (error) {
            this.logger.log(`Unable to get data from hash map`, LogLevel.Error, "REDIS-CACHE", error);
        }
    }
}

export default AppRedisClient;
