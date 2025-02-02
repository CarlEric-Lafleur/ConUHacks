import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  standalone: false,

  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
})
export class TimepickerComponent {
  @Input() selectedTime: string = '';

  @ViewChild('input') inputElement: ElementRef = {} as ElementRef;

  timeChange() {
    this.selectedTime = this.convertTime();
    console.log(this.selectedTime);
  }

  convertTime(): string {
    const time = this.inputElement.nativeElement.value;
    console.log(time);
    const type = time.split(' ')[1];
    const minutesAndHours = time.split(' ')[0];
    const hours = String(Number(time.split(':')[0]) + (type === 'PM' ? 12 : 0));
    const minutes = minutesAndHours.split(':')[1];
    return `${hours}:${minutes}`;
  }
}
