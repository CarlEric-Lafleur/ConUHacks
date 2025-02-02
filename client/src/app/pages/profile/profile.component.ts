import { Component, Input, OnInit } from '@angular/core';
import { AppUser } from '../../interfaces/user.interface';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import {
  Prescription,
  Schedule,
} from '../../interfaces/prescription.interface';

@Component({
  selector: 'app-profile',
  standalone: false,

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  readonly textNotNullOrWhitespacePattern = '.*\\S.*';
  constructor(private userService: UserService, private router: Router) {}
  public phoneNumber = '';
  public email: string | null = '';
  childrenInitialized = false;

  public children: AppUser[] = [];

  //   public onAbandon(child: string) {
  //     this.children = this.children.filter((c) => c.displayName != child);
  //   }

  ngOnInit(): void {
    this.phoneNumber = this.userService.getPhoneNumber();
    this.email = this.userService.getEmail();
    const userId = this.userService.getUserId();
    if (!userId) {
      this.router.navigate(['login']);
    } else {
      this.userService.fetchHelpees().subscribe((x) => {
        this.children = x;
        this.childrenInitialized = true;
      });
    }
  }

  save() {}
}
