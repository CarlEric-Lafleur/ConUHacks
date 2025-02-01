import { Component, Input } from '@angular/core';
import { DateService } from '../../../services/date/date.service';
import { Day, DrugType, Prescription, Schedule } from '../../../interfaces/prescription.interface';
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
    this.prescription.schedule.sort((a, b) => this.compareSchedule(a, b));
    const nextConsumeDate = this.getNextConsumeDate();
    const now = new Date();
    const timeDifference = nextConsumeDate.getTime() - now.getTime();

    if (timeDifference <= 24 * 60 * 60 * 1000) {
      this.timeLeft = `${Math.ceil(timeDifference / (60 * 60 * 1000))} hours`;
    } else {
      this.timeLeft = `${Math.ceil(timeDifference / (24 * 60 * 60 * 1000))} days`;
    }

    this.dateText = this.dateService.isSoon(nextConsumeDate.getTime())
      ? `Take in ${this.timeLeft}`
      : this.dateService.MMDDformat(nextConsumeDate.getTime());

    this.prescription.type ? this.setIcon(this.prescription.type) : null;
  }

  private compareSchedule(a: Schedule, b: Schedule): number {
    const now = new Date();
    const aDate = this.getDateFromSchedule(a);
    const bDate = this.getDateFromSchedule(b);
    return aDate.getTime() - bDate.getTime();
  }

  private getNextConsumeDate(): Date {
    const now = new Date();
    for (const schedule of this.prescription.schedule) {
      const scheduleDate = this.getDateFromSchedule(schedule);
      if (scheduleDate > now) {
        return scheduleDate;
      }
    }
    const firstSchedule = this.prescription.schedule[0];
    const firstScheduleDate = this.getDateFromSchedule(firstSchedule);
    firstScheduleDate.setDate(firstScheduleDate.getDate() + 7);
    return firstScheduleDate;
  }

  private getDateFromSchedule(schedule: Schedule): Date {
    const now = new Date();
    const dayOffset = this.getDayOffset(schedule.day);
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const scheduleDate = new Date(now);
    scheduleDate.setDate(now.getDate() + dayOffset);
    scheduleDate.setHours(hours, minutes, 0, 0);
    return scheduleDate;
  }

  private getDayOffset(day: Day): number {
    if (day === Day.Everyday) {
      return 0;
    }
    const now = new Date();
    const today = now.getDay();
    const targetDay: number = DAYS.findIndex((d) => d === Day[day]);
    const dayOffset = (targetDay - today + 7) % 7;
    return dayOffset;
  }


  public getIcon(): string {
    return this.icon;
  }

  private setIcon(icon: DrugType) {
    switch (icon) {
      case DrugType.PILL:
        this.icon = 'pill';
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