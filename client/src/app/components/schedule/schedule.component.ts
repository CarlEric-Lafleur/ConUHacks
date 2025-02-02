import { Component, Input } from '@angular/core';
import { Day, Schedule } from '../../interfaces/prescription.interface';

@Component({
  selector: 'app-schedule',
  standalone: false,

  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  @Input() schedule: Schedule = {} as Schedule;
  @Input() index: number = 1;

  showDay(): boolean {
    return this.schedule.day !== Day.Everyday;
  }

  dayOptions = [
    Day.Sunday,
    Day.Monday,
    Day.Tuesday,
    Day.Wednesday,
    Day.Thursday,
    Day.Friday,
    Day.Saturday,
  ];

  selectedTime: string = '';
}
