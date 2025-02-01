import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  isSoon(date: number): boolean {
    const oneDay= 24*60*60*1000;
    return (Date.now() - date < oneDay) ? true : false;
  }

  MMDDformat(epochDate:number): string{
        const date = new Date(epochDate)
        return `${String(date.getDay()).padStart(2,'0')}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  getDayText(date: Date): string {
    const inputDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.round(
      (inputDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays === 1) return 'Tomorrow';

    if (diffInDays < 0 && diffInDays >= -6) {
      return `Last ${inputDate.toLocaleDateString('en-US', {
        weekday: 'long',
      })}`;
    }

    if (diffInDays > 1 && diffInDays <= 6) {
      return `${inputDate.toLocaleDateString('en-US', {
        weekday: 'long',
      })}`;
    }

    if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;

    return `In ${diffInDays} days`;
  }

  getFormattedDate(date: Date): string {
    return this.getDayText(date) + ', at' + date.toLocaleTimeString('en-US');
  }
}
