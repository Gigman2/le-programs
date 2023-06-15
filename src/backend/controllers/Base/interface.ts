import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { ObjectId } from 'mongoose';
import BaseService from '@/backend/services/Base';
import IBaseService from '@/backend/services/Base/interface';


export interface IBaseParams {
    id: ObjectId | string;
}

export interface IBaseQuery {
    [key: string]: any;
}


export default interface IBaseController<S> {
    service: S;

    __call(method: string): void;
    log(error: { message: any }): void;
    objectId(id: string): mongoose.Types.ObjectId;
    insert(req: NextApiRequest, res: NextApiResponse): Promise<void>;
    get(req: NextApiRequest, res: NextApiResponse): Promise<void>;
    getById(req: { params: IBaseParams }, res: NextApiResponse): Promise<void>;
    getOne(req: { query: IBaseQuery }, res: NextApiResponse): Promise<void>;
    update(req: { params: IBaseParams, body: any }, res: NextApiResponse): Promise<void>;
    delete(req: { params: IBaseParams }, res: NextApiResponse): Promise<void>;
}
