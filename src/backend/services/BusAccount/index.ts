import { Model } from 'mongoose';
import { IBusAccount } from '@/interface/bus'
import BaseService from '../Base';
import AppCache from '@/backend/helpers/cache';
import axios from 'axios';
import { authAPI } from '@/backend/config/env';
import { IAccountUser } from '@/frontend/store/auth';

export default class BusAccountService extends BaseService<IBusAccount>  {
    protected readonly name = 'BusAccount';

    constructor(protected readonly model: Model<IBusAccount>) {
        super(model)
    }

    async getUser(id: string, authorization: string) {
        try {
            if (id) {
                const key = JSON.stringify(id) + '_cached_user'
                const cacheSystem = new AppCache()
                const storedUser = await cacheSystem.getCachedData(key) as string
                const parsedStoredUser = JSON.parse(storedUser) as { data: IAccountUser }
                if (!storedUser) {
                    const authorization_ = await this.generateBotAuth()
                    const { data: user } = await axios.get(`${authAPI}users/${id}`, {
                        headers: {
                            Authorization: authorization || authorization_
                        }
                    }
                    )
                    if (user.data) {
                        await cacheSystem.insertData(id, user)
                    }
                    return user
                } else {
                    return parsedStoredUser && parsedStoredUser.data ? parsedStoredUser : { data: parsedStoredUser }
                }
            } else {
                return {}
            }
        } catch (error) {
            this.log(error)
            return Promise.reject("An error occurred")
        }
    }

    async getUsers(userIds: string[], authorization: string, mapped = false) {
        try {
            const cacheSystem = new AppCache()
            const newUsersArrayData: any[] = []
            const unCachedUsersIds: any[] = []
            const params = new URLSearchParams()
            // get cached users in the userIds list
            await Promise.all(
                userIds.map(async userId => {
                    const user = await cacheSystem.getCachedData(JSON.stringify(userId) + '_cached_user')
                    if (user) {
                        return newUsersArrayData.push(user)
                    }
                    return unCachedUsersIds.push(userId)
                })
            )

            console.log('Cached ', unCachedUsersIds)
            console.log('Users ', newUsersArrayData)


            if (unCachedUsersIds.length) {
                params.append('_id', JSON.stringify({ $in: unCachedUsersIds }))

                console.log(`${authAPI}users?${params.toString()}`)
                const authorization_ = await this.generateBotAuth()
                const { data: users } = await axios.get(`${authAPI}users/bulk-get?${params.toString()}`, {
                    headers: {
                        Authorization: authorization || authorization_
                    }
                })
                if (users.data && users.data.length) {
                    users.data.forEach((item: any) => {
                        cacheSystem.insertData(item._id, item)
                    });
                    newUsersArrayData.push(...users.data)
                }
            }
            return mapped
                ? newUsersArrayData.reduce((obj, current) => {
                    const itemObj =
                        current && current.data && typeof current.data === 'object' ? current.data : current
                    if (!obj[itemObj._id]) {
                        obj[itemObj._id] = itemObj
                    }
                    return obj
                }, {})
                : newUsersArrayData
        } catch (error) {
            console.log(error)
            return Promise.reject(error)
        }
    }
}