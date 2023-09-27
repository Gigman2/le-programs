import response from '../../lib/response'
import mongoose, { ObjectId } from 'mongoose';
import { getLogger } from '@/backend/utils/logger';
import { NextApiRequest, NextApiResponse } from 'next';
import { IBaseQuery } from './interface';
import IBaseService from '@/backend/services/Base/interface';
// import EventEmitter from 'eventemitter3';

class BaseController<S extends IBaseService<any>> {
    protected name: string = 'Base';
    service: S;
    constructor(service: S) {
        this.service = service
    }

    /**
     * @param { string } method Unknown method called
     */
    __call(method: string) {
        this.log(new Error(`'${method}()' is missing!`))
    }

    /**
     * @param { object } error Error object
     * @return {Function}
     */
    log(error: { message: any }) {
        return getLogger().error(error)
    }

    /**
   * @param { string } id string id
   * @return {object} casted mongoose id object
   */
    objectId(id: string) {
        return new mongoose.Types.ObjectId(id)
    }

    /**
     * @summary Handle http request to create a new record
     * @param { { body: {} } } req  The express request object
     * @param { object }       res  The express response object
     * @fires BaseController#insert This method
     * fires an event when the controller is listening for
     * any event, to perform extract action(s) that is needed
     * after creating a new record
     * @return { Promise<Function> }
     */
    async insert(req: NextApiRequest, res: NextApiResponse) {
        try {
            const doc = await this.service.insert(req.body)
            return response.successWithData(res, doc, `${this.name} created successfully!`, 201)
        } catch (error: any) {
            return response.error(res, error.message || error)
        }
    }

    /**
   * @summary Handle http request to fetch records
   *
   * @param { { query: {} } } req The express request object
   * @param { object }        res The express response object
   * @return {Promise<Function>}
   */
    async get(req: NextApiRequest, res: NextApiResponse) {
        try {
            const doc = await this.service.get({ ...req.query, status: { "$ne": "ARCHIVED" } })
            return response.successWithData(res, doc)
        } catch (error: any) {
            console.log(error)
            return response.error(res, error.message || error)
        }
    }

    /**
   * @summary Handle http request to fetch a record by it identifier
   *
   * @param { { query: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   */
    async getById(req: NextApiRequest, res: NextApiResponse) {
        try {
            console.log(req.query.id)
            const doc = await this.service.getById((req.query as { id: string | string[] | ObjectId }).id)
            return response.successWithData(res, doc)
        } catch (error: any) {
            return response.error(res, error.message || error)
        }
    }

    /**
   * @summary Handle http request to fetch one record which matches the query params
   *
   * @param { { query: {} } } req The express request object
   * @param { object }        res The express response object
   * @return {Promise<Function>}
   */
    async getOne(req: { query: IBaseQuery }, res: NextApiResponse) {
        try {
            const doc = await this.service.getOne(req.query)
            return response.successWithData(res, doc)
        } catch (error: any) {
            return response.error(res, error.message || error)
        }
    }

    /**
   * @summary Handle http request to update a record
   *
   * @param { { query: { id: string }, body: {} } } req The express request object
   * @param { object }                                res The express response object
   * @fires BaseController#update This method
   * fires an event when the controller is listening for
   * any event, to perform extract action(s) that is needed
   * after a record has been updated
   * @return {Promise<Function>}
   */
    async update(req: NextApiRequest, res: NextApiResponse) {
        try {
            // if(hasAccess !== 200)
            const doc = await this.service.update((req.query as { id: string | string[] | ObjectId }).id, req.body)
            return response.successWithData(res, doc, `${this.name} updated successfully!`)
        } catch (error: any) {
            return response.error(res, error.message || error)
        }
    }

    /**
   * @summary Handle http request to delete a record
   * @param { { params: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   * @emits event:delete
   * @return {Promise<Function>}
   */
    async delete(req: NextApiRequest, res: NextApiResponse) {
        try {
            const doc = await this.service.update((req.query as { id: string | string[] | ObjectId }).id, { status: 'ARCHIVED' })
            return response.successWithData(res, doc, `${this.name} deleted successfully!`)
        } catch (error: any) {
            return response.error(res, error.message || error)
        }
    }
}

export default BaseController