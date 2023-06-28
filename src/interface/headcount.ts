export interface IHeadcount {
    _id: string;
    recorder: string;
    total: string;
    section: Record<string, number>
    created_on: string;
    updated_on: string;
}