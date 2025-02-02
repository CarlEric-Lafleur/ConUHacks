import { Component, Input } from '@angular/core';
import { DateService } from '../../../services/date/date.service';
import {
  Day,
  DrugType,
  Prescription,
  Schedule,
} from '../../../interfaces/prescription.interface';
import { DAYS } from '../../../constants/days.constants';
import { findIndex } from 'rxjs';
@Component({
  selector: 'app-medicine-card',
  standalone: false,

  templateUrl: './medicine-card.component.html',
  styleUrl: './medicine-card.component.scss',
})
export class MedicineCardComponent {
  constructor(private dateService: DateService) {}

  @Input() prescription!: Prescription;
  public dateText!: string;
  private icon!: string;
  public timeLeft!: string;

  ngOnInit() {
    console.log(this.prescription);

    this.dateText = this.dateService.getDateText(this.prescription);

    this.prescription.type ? this.setIcon(this.prescription.type) : null;
  }

  public getIcon(): string {
    return this.icon;
  }

  private setIcon(icon: DrugType) {
    switch (icon) {
      case DrugType.PILL:
        this.icon = 'Medication_Liquid';
        break;
      case DrugType.PATCH:
        this.icon = 'healing';
        break;
      case DrugType.OTHER:
        this.icon = 'medical_services';
        break;
    }
  }
}
