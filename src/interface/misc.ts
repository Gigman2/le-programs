export interface IDocument {
    _id?: string
    created_on?: Date;
    updated_on?: Date;
}

export interface IResponse<T> {
    message: string;
    statusCode: number;
    data: T
}