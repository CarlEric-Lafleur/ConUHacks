import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WARNING_NOTIFICATION_DURATION } from '../../constants/notifications.constants';
import { AUTHENTICATION_ERROR_MESSAGE } from '../../constants/firebase-error-message.constants';
import { AppRoutes } from '../../enums/app-routes.enum';
import { NotificationType } from '../../interfaces/notification-content';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationService } from '../notification/notification.service';
import { UserCommunicationService } from '../user-communication/user-communication.service';
import { AppUser, UserBaseInfo } from '../../interfaces/user.interface';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

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
        this.userCommunicationService.isUserAlreadyConnected(email).subscribe((isConnected: boolean) => {
            if (isConnected) {
                this.showErrorNotification("L'utilisateur utilisant cet email est déjà connecté sur un autre appareil");
            } else {
                this.signInWithFirebase(email, password);
            }
        });
    }

    signOut() {
        this.firebaseService.signOut().then(() => {
            // TODO: Add a method to disconnect the user from the socket
            this.user.next(null);
            this.router.navigate([AppRoutes.SignIn]);
        });
    }

    createAccount(email: string, username: string, password: string) {
        this.firebaseService
            .createUser(email, password)
            .then((user: User) => {
                this.handleNewAccountSuccess(user, username);
            })
            .catch((error) => {
                const errorMessage: string = AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Erreur inconnue';
                this.showErrorNotification(errorMessage);
            });
    }

    changeSelectedAvatar(avatarUrl: string) {
        const user = this.user.getValue();
        if (user) {
            this.userCommunicationService.changeSelectedAvatar(user._id, avatarUrl).subscribe((updatedUser: AppUser) => {
                this.user.next(updatedUser);
                this.showSuccessNotification('Avatar modifié avec succès!');
            });
        }
    }

    updateUsername(username: string) {
        const user = this.user.getValue();
        if (user) {
            this.userCommunicationService.updateUsername(user._id, username).subscribe((updatedUser: AppUser) => {
                this.user.next(updatedUser);
                this.showSuccessNotification("Le nom d'utilisateur a été modifié avec succès!");
            });
        }
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
            type: NotificationType.Warning,
            durationMs: WARNING_NOTIFICATION_DURATION,
        });
    }

    private async signInWithFirebase(email: string, password: string) {
        this.firebaseService
            .signIn(email, password)
            .then((user: User) => {
                this.handleSignInSuccess(user);
            })
            .catch((error) => {
                const errorMessage: string = AUTHENTICATION_ERROR_MESSAGE.get(error.code) || 'Erreur inconnue';
                this.showErrorNotification(errorMessage);
            });
    }
    private handleSignInSuccess(user: User) {
        this.userCommunicationService.fetchUserById(user.uid).subscribe((userData: AppUser) => {
            this.user.next(userData);
            this.showSuccessNotification(`Bon retour ${user.email}!`);
            this.router.navigate([AppRoutes.Home]);
        });
    }

    private handleNewAccountSuccess(user: User, username: string) {
        if (!user.email) {
            this.showErrorNotification("L'email n'a pas pu être validé. Veuillez reessayer");
            return;
        }
        this.userCommunicationService.createUser(this.setUserBaseInfo(user.email, username, user.uid)).subscribe((userData: AppUser) => {
            this.user.next(userData);
            this.showSuccessNotification(`Compte créé avec succès! Bienvenue ${user.email}!`);
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

    private setUserBaseInfo(email: string, username: string, userId: string): UserBaseInfo {
        return {
            _id: userId,
            email,
            displayName: username,
            phoneNumber: '',
        };
    }

}
