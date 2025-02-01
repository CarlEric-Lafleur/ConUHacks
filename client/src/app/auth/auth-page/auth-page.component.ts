import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-page',
  standalone: false,
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent {
  isNewUser = false;

  toggleAuthMode() {
    this.isNewUser = !this.isNewUser;
  }
}
