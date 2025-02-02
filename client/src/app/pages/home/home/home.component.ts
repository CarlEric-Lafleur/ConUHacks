import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Prescription,
} from '../../../interfaces/prescription.interface';
import { DateService } from '../../../services/date/date.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  constructor(private dateService: DateService, private userService: UserService, private router: Router) {}

  prescriptions: Prescription[] = [];

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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private subscribeToPrescriptions() {
    this.userService.user.subscribe((user) => {
      if (!user) return;
      this.prescriptions = user.prescriptions;
    });
  }

}
