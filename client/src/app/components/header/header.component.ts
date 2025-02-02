import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';
import { Role } from '../../interfaces/user.interface';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  role: Role | null = null;
  ROLES = Role;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (!user) return;
      this.role = user.role;
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  navigateTo(route: string): void {
    console.log(route)
    this.router.navigate([route]);
  }

}
