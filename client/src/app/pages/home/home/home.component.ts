import { Component, OnDestroy, OnInit } from '@angular/core';
import { Prescription } from '../../../interfaces/prescription.interface';
import { DateService } from '../../../services/date/date.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { Role } from '../../../interfaces/user.interface';
import { PrescriptionInfoService } from '../../../services/prescription-info.service';

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
    private userService: UserService,
    private router: Router,
    private prescriptionService: PrescriptionInfoService
  ) {}

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

  trackByDrugName(index: number, prescription: Prescription): string {
    return prescription.drugName;
  }

  navigateTo(route: string): void {
    if (route === 'form') {
      this.prescriptionService.setPrescription('new', -1);
    }
    this.router.navigate([route]);
  }

  private subscribeToPrescriptions() {
    this.userService.user.subscribe((user) => {
      if (!user) return;
      if (user.role === Role.Assistant) {
        this.userService
          .fetchPrescriptionsRelatedToAssistant(user.email)
          .subscribe((users) => {
            console.log(users);
            this.prescriptions = users.map((u) => u.prescriptions).flat();
            console.log(this.prescriptions);
          });
      } else {
        this.userService.user.subscribe((user) => {
          if (!user) return;
          this.prescriptions = user.prescriptions;
        });
      }
    });
  }
}
