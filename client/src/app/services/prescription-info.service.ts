import { Injectable } from '@angular/core';
import { Prescription } from '../interfaces/prescription.interface';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionInfoService {
  private prescription: Prescription| "new" = "new";
  index: number = -1;
  constructor() {}

  getPrescription() {
    return this.prescription;
  }
  setPrescription(prescription: Prescription | "new", index: number) {
    this.prescription = prescription;
    this.index = index;
  }

}
