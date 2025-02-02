import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  standalone: false,

  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
})
export class TimepickerComponent {
  @Input() selectedTime: string = '';

  timeChange(i: any) {
    console.log(this.selectedTime);
  }
}
