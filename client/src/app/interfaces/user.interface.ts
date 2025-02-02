import { Prescription } from "./prescription.interface";

export interface AppUser {
    _id: string;
    email: string;
    displayName: string;
    phoneNumber: string;
    prescriptions: Prescription[];
    assistMode: boolean;
    assistantInfo?: AssistantInfo;
    role: Role
}

export enum Role {
    Assisted = 'Assisted',
    Non_assisted = 'Non-assisted',
    Assistant = 'Assistant',
}
export interface AssistantInfo {
    name: string;
    email: string;
    phoneNumber: string;
}