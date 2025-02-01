import { Component } from '@angular/core';
import { DrugType, Prescription, Schedule } from '../../../interfaces/prescription.interface';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  medicines = [
    {
      drugName: 'Medicine 1',
      startDate:'1733082512',
      schedule:[
        {time:1738960106 } as Schedule,
        {time:1740833066} as Schedule
      ],
      type: DrugType.PILL
    } as Prescription,
    {
      drugName: 'Medicine 2',
      startDate:'1733082512',
      schedule:[
        {time:1738960106 } as Schedule,
        {time:1740833066} as Schedule
      ],
      type: DrugType.PILL
    } as Prescription,
  ];
}
