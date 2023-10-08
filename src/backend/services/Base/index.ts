/**
 * @author Eric Kojo Abbey  <abbeykojoeric@gmail.com>
 * @summary This class provides an interface to the model methods perform
 * CRUD related functionalities
 */

import { getLogger } from "@/backend/config/logger";
import mongoose, { Model, ObjectId } from "mongoose";
import { connectMongo } from "@/backend/utils/connectMongo";
import { botEmail, botPass } from "@/backend/config/env";

export default class BaseService<M> {
  constructor(protected readonly model: Model<M>) {
    this.initialize();
    this.model = model;
  }

  async initialize() {
    await connectMongo();
  }

  /**
   * @description { string } method Unknown method called
   */
  __call(method: string) {
    this.log(new Error(`'${method}()' is missing!`));
  }

  /**
   * @description function to log error to file
   */
  log = (error: any) => getLogger().error(error);

  /**
   * @description function to cast id string to  Object Id
   */
  objectId = (id: string) => new mongoose.Types.ObjectId(id);

  async get(...query: any[]) {
    try {
      return await this.model.find(
        query[0],
        query[1] || null,
        query[2] || null
      );
    } catch (error: any) {
      this.log(error.message);
      return [];
    }
  }

  exposeDocument<T>(doc: any) {
    return JSON.parse(JSON.stringify(doc)) as T
  }

  /**
   * @description Insert a new record to a collection (model)
   */
  async insert(payload: M, config?: any) {
    return await this.model.create(payload);
  }

  async getOne(query: any) {
    try {
      return await this.model.findOne(query);
    } catch (error: any) {
      this.log(error.message);
      return null;
    }
  }

  async update(
    id: string | string[] | ObjectId,
    payload: mongoose.UpdateWithAggregationPipeline | mongoose.UpdateQuery<M>
  ) {
    try {
      return await this.model.findByIdAndUpdate(id, payload, { new: true });
    } catch (error: any) {
      this.log(error.message);
      return null;
    }
  }

  async delete(id: string | string[] | ObjectId) {
    try {
      return await this.model.findByIdAndRemove(id);
    } catch (error: any) {
      this.log(error.message);
      return null;
    }
  }

  /**
   * @description Fetch a specific record from a collection (model)
   * using it's unique identifier
   */
  async getById(id: string | string[] | ObjectId) {
    try {
      return await this.model.findById(id);
    } catch (error: any) {
      this.log(error.message);
      return null;
    }
  }

  async deleteOne(...query: any) {
    try {
      return await this.model.findOneAndRemove({ ...query });
    } catch (error: any) {
      this.log(error.message);
      return null;
    }
  }

  async aggregate(query: any[]) {
    try {
      return await this.model.aggregate(query);
    } catch (error: any) {
      this.log(error.message);
      return [];
    }
  }


  /**
* returns generated bot authorization
*  @returns string
*/
  async generateBotAuth() {
    try {
      // generate auth bot to handle request
      const buff = Buffer.from(botEmail + ':' + botPass)
      const authorization_ = 'x-bot-auth ' + buff.toString('base64')
      return authorization_
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
