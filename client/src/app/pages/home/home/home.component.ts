import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Prescription,
  Frequency,
  Period,
  DrugType,
  Day,
} from '../../../interfaces/prescription.interface';
import { DateService } from '../../../services/date/date.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  constructor(
    private dateService: DateService,
    private userService: UserService
  ) {}

  prescriptions: Prescription[] = [
    {
      id: '1',
      drugName: 'Medicine 1',
      description: 'Take one pill daily',
      quantity: 30,
      doctorName: 'Dr. Smith',
      expirationDate: '2023-12-31',
      startDate: '2025-02-01',
      isRenewable: false,
      freq: {
        times: 1,
        period: Period.Day,
      },
      endDate: '2025',
      instructions: 'Take with water',
      schedule: [{ time: '16:30', day: Day.Everyday }],
      type: DrugType.PILL,
    } as Prescription,
    {
      id: '2',
      drugName: 'Medicine 2',
      description: 'Take one pill daily',
      quantity: 30,
      doctorName: 'Dr. Johnson',
      expirationDate: '2023-12-31',
      startDate: '1733082512',
      isRenewable: true,
      freq: {
        times: 2,
        period: Period.Week,
      },
      endDate: '1740833066',
      instructions: 'Take with water',
      schedule: [
        { time: '8:30', day: Day.Monday },
        { time: '12:30', day: Day.Friday },
        { time: '22:30', day: Day.Saturday },
      ],
      type: DrugType.PILL,
    } as Prescription,
  ];

  ngOnInit(): void {
    this.subscribeToPrescriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getPrescriptions() {
    return this.prescriptions.sort((a, b) =>
      this.dateService.comparePrescriptions(a, b)
    );
  }

  private subscribeToPrescriptions() {
    this.userService.user.subscribe((user) => {
      if (!user) return;
      this.prescriptions = user.prescriptions;
    });
  }
}
