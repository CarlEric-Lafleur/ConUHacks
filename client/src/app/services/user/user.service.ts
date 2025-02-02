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

@Injectable({
    providedIn: 'root',
})
export class UserService {
    user: BehaviorSubject<AppUser | null> = new BehaviorSubject<AppUser | null>(null);

    // To accommodate the specific requirements of this service we disable the eslint rule that enforces a maximum number of parameters
    // eslint-disable-next-line max-params
    constructor(
        private firebaseService: FirebaseService,
        private router: Router,
        private notificationService: NotificationService,
        private userCommunicationService: UserCommunicationService,
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
              const errorMessage: string = AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Erreur inconnue';
              this.showErrorNotification(errorMessage);
          });
    }

    createAssistantAccount( newAssistant: AssistantInfo, password: string) {
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
                const errorMessage: string = AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Erreur inconnue';
                this.showErrorNotification(errorMessage);
            });
    }

    updateAccount(user: AppUser) {
        this.userCommunicationService.updateUser(user).subscribe((userData: AppUser) => {
            this.user.next(userData);
            this.showSuccessNotification('Account updated successfully!');
        });
    }


    getUserId(): string | null {
        return this.firebaseService.getUserId();
    }

    getEmail(): string | null {
        return this.firebaseService.getEmail();
    }

    showErrorNotification(messageError: string) {
        this.notificationService.showBanner({
            message: messageError,
            type: NotificationType.Error,
            durationMs: WARNING_NOTIFICATION_DURATION,
        });
    }

    fetchHelpees(){
      return this.userCommunicationService.fetchHelpees(this.user.getValue()?.email!)
    }

    private async signInWithFirebase(email: string, password: string) {
        this.firebaseService
            .signIn(email, password)
            .then((user: User) => {
                this.handleSignInSuccess(user);
            })
            .catch((error) => {
                const errorMessage: string = AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Unknown error';
                this.showErrorNotification(errorMessage);
            });
    }
    private handleSignInSuccess(user: User) {
        this.userCommunicationService.fetchUserById(user.uid).subscribe((userData: AppUser) => {
            this.user.next(userData);
            this.showSuccessNotification(`Welcome ${user.email}!`);
            this.router.navigate([AppRoutes.Home]);
        });
    }

    private handleNewAssistantAccountSuccess(user: AppUser) {
        if (!user.email) {
            this.showErrorNotification("Assistant email could not be retrieved from the user's account");
            return;
        }
        this.userCommunicationService.createUser(user).subscribe((userData: AppUser) => {
            this.user.next(userData);
            this.signOutAssistant();
        });
    }

    private handleNewAccountSuccess(user: AppUser) {
        if (!user.email) {
            this.showErrorNotification("Email could not be retrieved from the user's account");
            return;
        }
        this.userCommunicationService.createUser(user).subscribe((userData: AppUser) => {
            this.user.next(userData);
            this.showSuccessNotification(`Account created successfully! Welcome ${user.email}!`);
            this.router.navigate([AppRoutes.Home]);
        });
    }

    private showSuccessNotification(messageSuccess: string) {
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
