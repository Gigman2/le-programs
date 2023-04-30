export interface IBusRound {
    busRep: string;
    busGroup: string;
    busState: 'EN_ROUTE' | 'ARRIVED';
    totalPeople: number;
    busFare: number;
    currentStation: string;
    arrivalTime: string;
    created_on: string;
    updated_on: string;
}