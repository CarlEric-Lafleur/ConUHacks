import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AppUser, Role } from '../../../interfaces/user.interface';

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
    role: Role.Non_assisted
  };

  assistantInfo = {
    name: '',
    email: '',
    phoneNumber: ''
  };
  assistantPassword = '';

  constructor(private userService: UserService) {}

  toggleAssistMode() {
    this.user.assistMode = !this.user.assistMode;
    this.user.role = Role.Assisted;
    if (!this.user.assistMode) {
      this.user.role = Role.Non_assisted;
      this.user.assistantInfo = undefined;
    }
  }

  createAccount() {
    if (this.validateUser()) {
      console.log('Creating account');
      this.createAccounts();
    }
  }

  private validateUser() {
    console.log(this.user);
    if (!this.validatephoneFormat(this.user.phoneNumber) || (this.user.assistantInfo?.phoneNumber && !this.validatephoneFormat(this.user.assistantInfo.phoneNumber))) {
      this.userService.showErrorNotification('The phone number must be in the format +1xxxxxxxxxx');
      return false;
    }
    if (!this.user.email || !this.user.displayName) {
      this.userService.showErrorNotification('Please fill in all fields');
      return false;
    }
    if (this.user.assistMode) {
      this.user.assistantInfo = this.assistantInfo;
      if (!this.user.assistantInfo || !this.user.assistantInfo.email || !this.user.assistantInfo.name || !this.assistantPassword) {
        this.userService.showErrorNotification('Please fill in all required fields about the assistant');
        return false;
      }
    }
    return true;
  }

  //should be +1xxxxxxxxxx format
  private validatephoneFormat(phoneNumber: string): boolean {
    return phoneNumber.match(/^\+[1-9]\d{1,14}$/) !== null;
  }

  private createAccounts() {
    if (this.user.assistMode && this.assistantInfo) {
      console.log('Creating assistant account');
      this.userService.createAssistantAccount(this.assistantInfo, this.assistantPassword);
    } 
    console.log('Creating user account');
    this.userService.createAccount(this.user, this.password);
  }
}