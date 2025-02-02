import { Injectable } from '@angular/core';
import {
  Day,
  Prescription,
  Schedule,
} from '../../interfaces/prescription.interface';
import { DAYS } from '../../constants/days.constants';

const THREE_HOURS = 3 * 60 * 60 * 1000;

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
    console.log(nextConsumeDate);
    const now = new Date();
    const timeDifference = nextConsumeDate.getTime() - now.getTime();

    let timeLeft: string;

    if (timeDifference <= 0) {
      return 'Take now';
    } else if (timeDifference <= 60 * 1000) {
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

  readyToTake(prescription: Prescription): boolean {
    const nextConsumeDate = this.getNextConsumeDate(prescription);
    const now = new Date();
    const timeDifference = nextConsumeDate.getTime() - now.getTime();
    return timeDifference <= 0;
  }

  takeNow(prescription: Prescription) {
    this.getNextConsume(prescription);
  }

  private getNextConsume(prescription: Prescription): void {
    const now = new Date();

    const new_pres = prescription.schedule.map((schedule) => {
      return {
        time:
          (this.getDateFromSchedule(schedule).getTime() +
            THREE_HOURS -
            now.getTime()) %
          (7 * 24 * 60 * 60 * 1000),
        schedule,
      };
    });
    const nextConsume = new_pres.reduce((a, b) => (a.time < b.time ? a : b));
    nextConsume.schedule.isTaken = true;
  }

  private getNextConsumeDate(prescription: Prescription): Date {
    // for (const schedule of prescription.schedule) {
    //   const scheduleDate = this.getDateFromSchedule(schedule);
    //   if (scheduleDate > now) {
    //     return scheduleDate;
    //   }
    // }
    // const firstSchedule = prescription.schedule[0];
    // const firstScheduleDate = this.getDateFromSchedule(firstSchedule);
    // firstScheduleDate.setDate(firstScheduleDate.getDate() + 7);
    // return firstScheduleDate;
    const now = new Date();

    const new_pres = prescription.schedule.map((schedule) => {
      return (
        (this.getDateFromSchedule(schedule).getTime() +
          THREE_HOURS -
          now.getTime()) %
        (7 * 24 * 60 * 60 * 1000)
      );
    });
    return new Date(Math.min(...new_pres) + now.getTime() - THREE_HOURS);
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

    const [hours, minutes] = schedule.time.split(':').map(Number);
    const dayOffset = this.getDayOffset(schedule, hours, minutes);
    const scheduleDate = new Date(now);

    scheduleDate.setDate(now.getDate() + dayOffset);
    scheduleDate.setHours(hours, minutes, 0, 0);
    // console.log(now);
    // console.log(scheduleDate);
    return scheduleDate;
  }

  private getDayOffset(
    schedule: Schedule,
    hours: number,
    minutes: number
  ): number {
    const now = new Date();
    const day = schedule.day;
    if (day === Day.Everyday) {
      return this.isMoreThanThreeHours(hours, minutes) ? 1 : 0;
    }

    const today = now.getDay();
    const targetDay: number = DAYS.findIndex((d) => d === Day[day]);

    const dayOffset = (targetDay - today + 7) % 7;
    return dayOffset;
  }

  isMoreThanThreeHours(hours: number, minutes: number): boolean {
    const now = new Date();
    const now_hours = now.getHours();
    const now_minutes = now.getMinutes();
    return (
      Math.abs(hours * 60 + minutes - (now_hours * 60 + now_minutes)) > 180
    );
  }
}
