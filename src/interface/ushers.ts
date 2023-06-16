export interface IHeadcount {
    recorder: string;
    total: string;
    section: Record<string, number>
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    created_on: string;
    updated_on: string;
}

export interface IUshersReport {
    recorder: string;
    total: string;
    section: Record<string, number>
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    created_on: string;
    updated_on: string;
}