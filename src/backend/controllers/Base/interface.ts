import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';


export interface IBaseParams {
    [key: string]: string | string[];
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
    getById(req: NextApiRequest, res: NextApiResponse): Promise<void>;
    getOne(req: { query: IBaseQuery }, res: NextApiResponse): Promise<void>;
    update(req: NextApiRequest, res: NextApiResponse): Promise<void>;
    delete(req: NextApiRequest, res: NextApiResponse): Promise<void>;
}
