import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WARNING_NOTIFICATION_DURATION } from '../../constants/notifications.constants';
import { AUTHENTICATION_ERROR_MESSAGE } from '../../constants/firebase-error-message.constants';
import { AppRoutes } from '../../enums/app-routes.enum';
import { NotificationType } from '../../interfaces/notification-content';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationService } from '../notification/notification.service';
import { UserCommunicationService } from '../user-communication/user-communication.service';
import { AppUser, AssistantInfo, Role } from '../../interfaces/user.interface';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { user } from '@angular/fire/auth';
import { Prescription } from '../../interfaces/prescription.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: BehaviorSubject<AppUser | null> = new BehaviorSubject<AppUser | null>(
    null
  );

  // To accommodate the specific requirements of this service we disable the eslint rule that enforces a maximum number of parameters
  // eslint-disable-next-line max-params
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private notificationService: NotificationService,
    private userCommunicationService: UserCommunicationService
  ) {}

  signIn(email: string, password: string) {
    this.signInWithFirebase(email, password);
  }

  signOut() {
    this.firebaseService.signOut().then(() => {
      // TODO: Add a method to disconnect the user from the socket
      this.user.next(null);
      this.router.navigate([AppRoutes.SignIn]);
    });
  }

  createAccount(newUser: AppUser, password: string) {
    this.firebaseService
      .createUser(newUser.email, password)
      .then((user: User) => {
        newUser._id = user.uid;
        this.handleNewAccountSuccess(newUser);
      })
      .catch((error) => {
        const errorMessage: string =
          AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Erreur inconnue';
        this.showErrorNotification(errorMessage);
      });
  }

  createAssistantAccount(newAssistant: AssistantInfo, password: string) {
    this.firebaseService
      .createUser(newAssistant.email, password)
      .then((user: User) => {
        let newUser: AppUser = {
          _id: user.uid,
          email: newAssistant.email,
          displayName: newAssistant.name,
          phoneNumber: newAssistant.phoneNumber,
          prescriptions: [],
          assistMode: true,
          assistantInfo: newAssistant,
          role: Role.Assistant,
        };
        this.handleNewAssistantAccountSuccess(newUser);
      })
      .catch((error) => {
        const errorMessage: string =
          AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Erreur inconnue';
        this.showErrorNotification(errorMessage);
      });
  }

  addPrescription(prescription: Prescription) {
    const user = this.user.getValue();
    if (!user) {
      this.showErrorNotification('User not found');
      return;
    }
    console.log(user);
    if(!user.prescriptions) {
      this.userCommunicationService.pushDrug(user._id, prescription).subscribe();
      user.prescriptions = [prescription];
      this.user.next(user);
    } else {
      user.prescriptions.push(prescription);
      this.updateAccount(user);
    }

  }


  updatePrescription(index: number, prescription: Prescription) {
    const user = this.user.getValue();
    if (!user) {
      this.showErrorNotification('User not found');
      return;
    }
    user.prescriptions[index] = prescription;
    this.updateAccount(user);
  }


  pushPrescription(prescription: Prescription, userId: string) {
    this.userCommunicationService.pushDrug(userId, prescription).subscribe();
  }

  updateAccount(user: AppUser) {
    this.userCommunicationService
      .updateUser(user)
      .subscribe((userData: AppUser) => {
        this.user.next(userData);
        console.log('Account updated successfully!');
        this.showSuccessNotification('Account updated successfully!');
      });
  }

  getUserId(): string | null {
    return this.firebaseService.getUserId();
  }

  getEmail(): string | null {
    return this.firebaseService.getEmail();
  }

  getPhoneNumber(): string {
    return this.user.getValue()?.phoneNumber || '';
  }

  showErrorNotification(messageError: string) {
    this.notificationService.showBanner({
      message: messageError,
      type: NotificationType.Error,
      durationMs: WARNING_NOTIFICATION_DURATION,
    });
  }

  fetchPrescriptionsRelatedToAssistant(email: string) {
    return this.userCommunicationService.fetchHelpees(email);
  }

  fetchHelpees() {
    const email = this.user.getValue()?.email;
    return this.userCommunicationService.fetchHelpees(email ?? '');
  }

  private async signInWithFirebase(email: string, password: string) {
    this.firebaseService
      .signIn(email, password)
      .then((user: User) => {
        this.handleSignInSuccess(user);
      })
      .catch((error) => {
        const errorMessage: string =
          AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Unknown error';
        this.showErrorNotification(errorMessage);
      });
  }
  private handleSignInSuccess(user: User) {
    this.userCommunicationService
      .fetchUserById(user.uid)
      .subscribe((userData: AppUser) => {
        this.user.next(userData);
        console.log(`Welcome ${userData.email}!`);
        this.showSuccessNotification(`Welcome ${user.email}!`);
        this.router.navigate([AppRoutes.Home]);
      });
  }

  private handleNewAssistantAccountSuccess(user: AppUser) {
    if (!user.email) {
      this.showErrorNotification(
        "Assistant email could not be retrieved from the user's account"
      );
      return;
    }
    this.userCommunicationService
      .createUser(user)
      .subscribe((userData: AppUser) => {
        this.user.next(userData);
        this.signOutAssistant();
      });
  }

  private handleNewAccountSuccess(user: AppUser) {
    this.user.next(user);
    if (!user.email) {
      this.showErrorNotification(
        "Email could not be retrieved from the user's account"
      );
      return;
    }
    this.userCommunicationService
      .createUser(user)
      .subscribe((userData: AppUser) => {
        this.showSuccessNotification(
          `Account created successfully! Welcome ${user.email}!`
        );
        this.router.navigate([AppRoutes.Home]);
      });
  }

  showSuccessNotification(messageSuccess: string) {
    this.notificationService.showBanner({
      message: messageSuccess,
      type: NotificationType.Success,
      durationMs: WARNING_NOTIFICATION_DURATION,
    });
  }

  private signOutAssistant() {
    this.firebaseService.signOut();
  }
}
