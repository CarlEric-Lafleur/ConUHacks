import { Component } from '@angular/core';
import { Prescription, Frequency, Period, DrugType, Day } from '../../../interfaces/prescription.interface';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  prescriptions: Prescription[] = [
      {
          id: '1',
          drugName: 'Medicine 1',
          description: 'Take one pill daily',
          quantity: 30,
          doctorName: 'Dr. Smith',
          expirationDate: '2023-12-31',
          startDate: '2025-02-01',
          freq: {
              times: 1,
              period: Period.Day
          },
          endDate: '2025',
          instructions: 'Take with water',
          schedule: [
              { time: "18:30",
                day: Day.Everyday 
              },
          ],
          type: DrugType.PILL
      } as Prescription,
      {
          id: '2',
          drugName: 'Medicine 2',
          description: 'Take one pill daily',
          quantity: 30,
          doctorName: 'Dr. Johnson',
          expirationDate: '2023-12-31',
          startDate: '1733082512',
          freq: {
            times: 2,
            period: Period.Week
          },
          endDate: '1740833066',
          instructions: 'Take with water',
          schedule: [
              { time: "8:30", day: Day.Monday },
              { time: "12:30", day: Day.Friday }
          ],
          type: DrugType.PILL
      } as Prescription,
  ];
  }
