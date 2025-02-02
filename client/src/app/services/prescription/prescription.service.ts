import { Injectable } from '@angular/core';
import { Prescription } from '../../interfaces/prescription.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../../interfaces/user.interface';
import { HttpCommunicationService } from '../http-communication/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private URL= "http://127.0.0.1:8000/prescriptions/"
  constructor(
    private httpClient: HttpCommunicationService
  ) { }
  public addPrescription(userId: string, prescription: Prescription): Observable<AppUser> {
    return this.httpClient.basicPost(`${this.URL}${userId}`,prescription)
  }
  public getPrescription(userId: string): Observable<Prescription[]> {
    return this.httpClient.basicGet<Prescription[]>(`${this.URL}${userId}`)
  }


}
