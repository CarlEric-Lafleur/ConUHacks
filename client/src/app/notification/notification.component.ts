import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationContent } from '../interfaces/notification-content';
import { NotificationService } from '../services/notification/notification.service';
import { Subscription, take, timer } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: false,
  
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: NotificationContent;
  private subscription: Subscription = new Subscription();
  private notificationStackedCount: number;

  constructor(private notificationService: NotificationService) {
      this.notification = new NotificationContent();
      this.notificationStackedCount = 0;
  }

  ngOnInit() {
      this.subscription = this.notificationService.notificationState$.subscribe((notification) => {
          if (!notification) return;

          this.notification = notification;
          this.notificationStackedCount++;

          timer(notification.durationMs)
              .pipe(take(1))
              .subscribe(() => {
                  if (--this.notificationStackedCount === 0) {
                      this.hideNotification();
                  }
              });
      });
  }

  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }

  hideNotification() {
      this.notificationService.hideBanner();
      this.reset();
  }

  reset() {
      this.notification = new NotificationContent();
  }
}
