import { Prescription } from "./prescription.interface";

export interface AppUser {
    _id: string;
    email: string;
    displayName: string;
    photoURL: string;
    phoneNumber: string;
    isProfileComplete: boolean;
    prescriptions: Prescription[];
}



export interface UserBaseInfo {
    _id: string;
    email: string;
    displayName: string;
    phoneNumber: string;
}