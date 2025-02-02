import { Injectable } from '@angular/core';
import {
  Day,
  Prescription,
  Schedule,
} from '../../interfaces/prescription.interface';
import { DAYS } from '../../constants/days.constants';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  isSoon(date: number): boolean {
    const oneDay = 24 * 60 * 60 * 1000;
    return Date.now() - date < oneDay ? true : false;
  }

  MMDDformat(epochDate: number): string {
    const date = new Date(epochDate);
    return `${String(date.getDay()).padStart(2, '0')}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;
  }

  getDateText(prescription: Prescription): string {
    prescription.schedule.sort((a, b) => this.compareSchedule(a, b));
    const nextConsumeDate = this.getNextConsumeDate(prescription);
    const now = new Date();
    const timeDifference = nextConsumeDate.getTime() - now.getTime();

    let timeLeft: string;

    if (timeDifference <= 60 * 1000) {
      timeLeft = '1 minute';
    } else if (timeDifference <= 60 * 60 * 1000) {
      timeLeft = `${Math.ceil(timeDifference / (60 * 1000))} minutes`;
    } else if (timeDifference <= 24 * 60 * 60 * 1000) {
      timeLeft = `${Math.ceil(timeDifference / (60 * 60 * 1000))} hours`;
    } else {
      timeLeft = `${Math.ceil(timeDifference / (24 * 60 * 60 * 1000))} days`;
    }

    return this.isSoon(nextConsumeDate.getTime())
      ? `Take in ${timeLeft}`
      : this.MMDDformat(nextConsumeDate.getTime());
  }

  private getNextConsumeDate(prescription: Prescription): Date {
    const now = new Date();
    for (const schedule of prescription.schedule) {
      const scheduleDate = this.getDateFromSchedule(schedule);
      if (scheduleDate > now) {
        return scheduleDate;
      }
    }
    const firstSchedule = prescription.schedule[0];
    const firstScheduleDate = this.getDateFromSchedule(firstSchedule);
    firstScheduleDate.setDate(firstScheduleDate.getDate() + 7);
    return firstScheduleDate;
  }

  private compareSchedule(a: Schedule, b: Schedule): number {
    const now = new Date();
    const aDate = this.getDateFromSchedule(a);
    const bDate = this.getDateFromSchedule(b);
    return aDate.getTime() - bDate.getTime();
  }

  comparePrescriptions(a: Prescription, b: Prescription): number {
    const aDate = this.getNextConsumeDate(a);
    const bDate = this.getNextConsumeDate(b);
    return aDate.getTime() - bDate.getTime();
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
}
