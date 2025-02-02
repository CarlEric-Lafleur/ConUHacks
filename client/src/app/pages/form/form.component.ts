import { Component, Input } from '@angular/core';
import { Interval, PosologyInfo } from '../../interfaces/posology-info';
import {
  Day,
  Period,
  Prescription,
} from '../../interfaces/prescription.interface';
import { PrescriptionInfoService } from '../../services/prescription-info.service';
import { Router } from '@angular/router';
import { AppPages } from '../../enums/app-pages.enum';

@Component({
  selector: 'app-form',
  standalone: false,

  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  constructor(
    private prescriptionInfoService: PrescriptionInfoService,
    private router: Router
  ) {}

  readonly textNotNullOrWhitespacePattern = '.*\\S.*';

  prescription: Prescription = {} as Prescription;

  ngOnInit() {
    if (!this.prescriptionInfoService.prescription) {
      this.router.navigate([AppPages.Home]);
    }
    const value = this.prescriptionInfoService.prescription!;
    if (value == "new") {
      this.prescription = {} as Prescription;
    } else {
      this.prescription = value;
    }
  }

  save() {}

  ngOnDestroy() {
    this.prescriptionInfoService.prescription = null;
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
}
