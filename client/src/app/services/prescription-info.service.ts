import { Injectable } from '@angular/core';
import { Prescription } from '../interfaces/prescription.interface';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionInfoService {
  prescription: Prescription | null | "new" = null;
  constructor() {}
}
