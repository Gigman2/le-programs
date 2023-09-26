import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

interface BaseService {
    insert(data: any): Promise<any>;
    get(query: any): Promise<any>;
    getById(id: string): Promise<any>;
    getOne(query: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
}

interface BaseLogger {
    error(message: any): Function;
}

interface BaseControllerOptions {
    service: BaseService;
    controller: any;
}

interface BaseResponse {
    successWithData(res: NextApiResponse, data: any, message?: string, status?: number): void;
    error(res: NextApiResponse, errorMessage: string): void;
}

interface BaseParams {
    id: string;
}

interface BaseQuery {
    [key: string]: any;
}

interface BaseController {
    name: string;
    service: BaseService;
    controller: any;

    __call(method: string): void;
    log(error: { message: any }): Function;
    objectId(id: string): mongoose.Types.ObjectId;
    insert(req: NextApiRequest, res: NextApiResponse): Promise<void>;
    get(req: NextApiRequest, res: NextApiResponse): Promise<void>;
    getById(req: { params: BaseParams }, res: NextApiResponse): Promise<void>;
    getOne(req: { query: BaseQuery }, res: NextApiResponse): Promise<void>;
    update(req: { params: BaseParams, body: any }, res: NextApiResponse): Promise<void>;
    delete(req: { params: BaseParams }, res: NextApiResponse): Promise<void>;
}

declare const response: BaseResponse;
declare function getLogger(): BaseLogger;

export type {
    BaseService,
    BaseLogger,
    BaseControllerOptions,
    BaseResponse,
    BaseParams,
    BaseQuery,
    BaseController,
};
