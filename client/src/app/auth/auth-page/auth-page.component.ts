import { Component } from '@angular/core';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, VALID_CHARACTERS } from '../../constants/username-contraints.constants';
import { UsernameErrorMessage } from '../../enums/username-error-message.enum';
import { UserService } from '../../services/user/user.service';
@Component({
    selector: 'app-auth-page',
    templateUrl: './auth-page.component.html',
    standalone: false,
    styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent {
    email: string = '';
    password: string = '';
    username: string = '';
    isSignInMode: boolean = true;

    constructor(private userService: UserService) {}

    toggleMode() {
        this.isSignInMode = !this.isSignInMode;
    }

    onSubmit() {
        if (this.isSignInMode) {
            this.userService.signIn(this.email, this.password);
        } else {
            this.validateUsernameAndCreateAccount();
        }
    }

    private validateUsernameAndCreateAccount() {
        if (this.validateUsername()) {
            this.userService.createAccount(this.email, this.username, this.password);
        }
    }

    private validateUsername(): boolean {
        let errorMessage: UsernameErrorMessage | null = null;
        switch (true) {
            case this.username.length < MIN_USERNAME_LENGTH:
                errorMessage = UsernameErrorMessage.TooShort;
                break;
            case this.username.length > MAX_USERNAME_LENGTH:
                errorMessage = UsernameErrorMessage.TooLong;
                break;
            case !VALID_CHARACTERS.test(this.username):
                errorMessage = UsernameErrorMessage.InvalidCharacters;
                break;
        }
        if (errorMessage) {
            this.userService.showErrorNotification(errorMessage);
            return false;
        }
        return true;
    }
}
