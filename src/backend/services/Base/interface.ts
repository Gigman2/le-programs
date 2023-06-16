import { ObjectId } from 'mongoose';

interface IBaseService<M> {
    __call(method: string): void;
    log(error: any): void;
    objectId(id: string): ObjectId;
    get(...query: any[]): Promise<M[]>;
    insert(payload: M): Promise<M>;
    getOne(query: any): Promise<M | null>;
    update(id: ObjectId | string | string[], payload: any): Promise<M | null>;
    delete(id: ObjectId | string | string[]): Promise<M | null>;
    getById(id: ObjectId | string | string[]): Promise<M | null>;
    deleteOne(...query: any[]): Promise<M | null>;
    aggregate(query: any[]): Promise<any[]>;
}


export default IBaseService;