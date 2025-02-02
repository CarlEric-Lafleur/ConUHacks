import { Component, Input } from '@angular/core';
import { Interval, PosologyInfo } from '../../interfaces/posology-info';
import { Period, Prescription } from '../../interfaces/prescription.interface';
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
    this.prescription = this.prescriptionInfoService.prescription!;
  }

  ngOnDestroy() {
    this.prescriptionInfoService.prescription = null;
  }

  selectedTime: string = '';

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
