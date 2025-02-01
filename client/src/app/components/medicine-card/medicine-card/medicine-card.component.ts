import { Component, Input } from '@angular/core';
import { DateService } from '../../../services/date/date.service';

@Component({
  selector: 'app-medicine-card',
  standalone: false,

  templateUrl: './medicine-card.component.html',
  styleUrl: './medicine-card.component.scss',
})
export class MedicineCardComponent {
  constructor(private dateService: DateService) {}
  @Input() medicine: any;

  ngOnInit() {
    console.log(this.dateService.getFormattedDate(new Date())); // Today
    console.log(
      this.dateService.getFormattedDate(new Date(Date.now() - 86400000))
    ); // Yesterday
    console.log(
      this.dateService.getFormattedDate(new Date(Date.now() + 86400000))
    ); // Tomorrow
    console.log(
      this.dateService.getFormattedDate(new Date(Date.now() - 3 * 86400000))
    ); // 3 days ago
    console.log(
      this.dateService.getFormattedDate(new Date(Date.now() + 5 * 86400000))
    ); // In 5 days
  }
}
