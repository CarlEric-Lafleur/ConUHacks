import { Component, Input } from '@angular/core';
import { DateService } from '../../../services/date/date.service';
import { DrugType, Prescription } from '../../../interfaces/prescription.interface';

@Component({
  selector: 'app-medicine-card',
  standalone: false,

  templateUrl: './medicine-card.component.html',
  styleUrl: './medicine-card.component.scss',
})
export class MedicineCardComponent {
  constructor(private dateService: DateService) {}

  @Input() medicine!: Prescription;
  public dateText!: string;

  private icon!: string;

  ngOnInit() {
    this.medicine.schedule.sort((a,b)=>b.time-a.time)
    const nextConsumeDateEpoch = this.medicine.schedule[0].time
    this.dateText = this.dateService.isSoon(nextConsumeDateEpoch)?
      `Take in ${(Date.now() - nextConsumeDateEpoch) / (60*60*1000)} hours` :  this.dateService.MMDDformat(nextConsumeDateEpoch)
    this.medicine.type ? this.setIcon(this.medicine.type) : null
  }

  public getIcon(): string {
    console.log(this.icon)
    return this.icon;
  }

  private setIcon(icon: DrugType){
    switch(icon){
      case DrugType.PILL:
          this.icon = "pill"
          break;
      case DrugType.PATCH:
          this.icon = "healing";
          break;
      case DrugType.OTHER:
          this.icon = "medical_services"
        break;
    }
  }

}
