import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AppUser } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-first-connection',
  standalone: false,
  
  templateUrl: './first-connection.component.html',
  styleUrl: './first-connection.component.scss'
})
export class FirstConnectionComponent {
  password = '';
  user: AppUser = {
    _id: '',
    email: '',
    displayName: '',
    phoneNumber: '',
    assistMode: false,
    assistantInfo: {
      name: '',
      email: '',
      phoneNumber: ''
    },
    prescriptions: [],
  };

  constructor(private userService: UserService) {}

  toggleAssistMode() {
    this.user.assistMode = !this.user.assistMode;
    if (!this.user.assistMode) {
      this.user.assistantInfo = undefined;
    }
  }

  createAccount() {
    if (this.validateUser()) {
      this.userService.createAccount(this.user, this.password);
    }
  }

  private validateUser() {
    if (!this.user.email || !this.user.displayName || !this.user.phoneNumber) {
      this.userService.showErrorNotification('Please fill in all fields');
      return false;
    }

    if (this.user.assistMode) {
      if (!this.user.assistantInfo || !this.user.assistantInfo.email || !this.user.assistantInfo.name || !this.user.assistantInfo.phoneNumber) {
        this.userService.showErrorNotification('Please fill in all required fields about the person to contact');
        return false;
      }
    }

    return true;
  }
}