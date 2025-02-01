export interface Prescription {
    id: string;
    drugName: string;
    description: string;
    quantity: number;
    doctorName: string;
    expirationDate: string;
    startDate: string;
    freq: Frequency;
    endDate: string;
    instructions: string;
    schedule: Schedule[];

}

export interface Schedule {
    day: Day;
    time: string;
}

export interface Frequency {
    times: number;
    period: Period;
}

export enum Period {
    Day = 'day',
    Week = 'week',
}

export enum Day {
    Sunday = 'Sunday',
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Everyday = 'Everyday',
}