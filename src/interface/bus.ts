export interface IBusRound {
    _id: string
    busRep: string;
    busGroup: string;
    busState: 'EN_ROUTE' | 'ARRIVED';
    totalPeople: number;
    busFare: number;
    currentStation: string;
    totalFare: number
    arrivalTime: string;
    created_on: string;
    updated_on: string;
    eventName: string
}