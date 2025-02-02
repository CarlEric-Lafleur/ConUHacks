import { Component, Input } from '@angular/core';
import { Interval, PosologyInfo } from '../../interfaces/posology-info';
import {
  Day,
  DrugType,
  Period,
  Prescription,
} from '../../interfaces/prescription.interface';
import { PrescriptionInfoService } from '../../services/prescription-info.service';
import { Router } from '@angular/router';
import { AppPages } from '../../enums/app-pages.enum';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-form',
  standalone: false,

  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  private isNewPrescription: boolean = false;
  private index: number = -1;
  constructor(
    private prescriptionInfoService: PrescriptionInfoService,
    private router: Router,
    private userService: UserService
  ) {}

  readonly textNotNullOrWhitespacePattern = '.*\\S.*';

  prescription: Prescription = {} as Prescription;

  ngOnInit() {
    if (
      !this.prescriptionInfoService.getPrescription() &&
      this.prescriptionInfoService.index === -1
    ) {
      this.router.navigate([AppPages.Home]);
    }
    const value = this.prescriptionInfoService.getPrescription();
    this.index = this.prescriptionInfoService.index;
    if (value == 'new') {
      this.isNewPrescription = true;
      this.prescription = {
        id: '',
        doctorName: '',
        expirationDate: '',
        instructions: '',
        type: DrugType.PILL,
        drugName: '',
        description: '',
        quantity: 0,
        startDate: '',
        endDate: '',
        isRenewable: false,
        freq: {
          times: 1,
          period: Period.Day,
        },
        schedule: [
          {
            day: Day.Everyday,
            time: '10:00',
            hasBeenNotified: false,
            isTaken: false,
          },
        ],
      } as Prescription;
    } else {
      this.isNewPrescription = false;
      this.prescription = value;
    }
  }

  save() {
    this.validatePrescription();
    if (this.isNewPrescription) {
      this.userService.addPrescription(this.prescription);
    } else {
      this.userService.updatePrescription(this.index, this.prescription);
    }
    this.userService.showSuccessNotification('Prescription saved successfully');
    this.router.navigate([AppPages.Home]);
  }

  ngOnDestroy() {
    this.prescriptionInfoService.setPrescription('new', -1);
  }

  //   selectedTime: string = '';

  periodOptions = [Period.Day, Period.Week];

  onSelectChange() {
    if (this.prescription.freq.period === Period.Day) {
      this.prescription.schedule.forEach((schedule) => {
        schedule.day = Day.Everyday;
      });
    } else {
      this.prescription.schedule.forEach((schedule) => {
        schedule.day = Day.Sunday;
      });
    }
  }

  onBlurFreq() {
    while (this.prescription.schedule.length < this.prescription.freq.times) {
      this.prescription.schedule.push({
        day:
          this.prescription.freq.period === Period.Day
            ? Day.Everyday
            : Day.Sunday,
        time: '10:00',
        hasBeenNotified: false,
        isTaken: false,
      });
    }
    while (this.prescription.schedule.length > this.prescription.freq.times) {
      this.prescription.schedule.pop();
    }
  }

  foundPrescription(posologyInfo: PosologyInfo) {
    this.prescription.drugName = posologyInfo.drug_name;
    this.prescription.description = posologyInfo.description;
    this.prescription.quantity = posologyInfo.quantity;
    this.prescription.startDate = posologyInfo.start_date;
    this.prescription.endDate = posologyInfo.end_date;
    this.prescription.isRenewable = posologyInfo.renew;
    this.prescription.freq = {
      times: Number(posologyInfo.frequence),
      period: this.convertInterval(posologyInfo.interval),
    };
    this.onBlurFreq();
    this.onSelectChange();
  }

  convertInterval(interval: Interval): Period {
    switch (interval) {
      case 'semaine':
        return Period.Week;
      case 'jour':
        return Period.Day;
    }
  }

  private validatePrescription() {
    if (this.prescription.drugName === '') {
      this.userService.showErrorNotification('Drug name is required');
    }
    if (this.prescription.quantity === 0) {
      this.userService.showErrorNotification('Quantity is required');
    }
    if (this.prescription.startDate === '') {
      this.userService.showErrorNotification('Start date is required');
    }
    if (this.prescription.endDate === '') {
      this.userService.showErrorNotification('End date is required');
    }
    if (this.prescription.freq.times === 0) {
      this.userService.showErrorNotification('Frequency is required');
    }
    if (this.prescription.schedule.length === 0) {
      this.userService.showErrorNotification('Schedule is required');
    }
  }
}
