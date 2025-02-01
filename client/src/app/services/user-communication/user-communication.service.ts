import { Injectable } from '@angular/core';
import { USER_API_PATH } from '../../constants/communication.service.constants';
import { HttpCommunicationService } from '../http-communication/http-communication.service';
import { AppUser, UserBaseInfo } from '../../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class UserCommunicationService {
    constructor(private communicationService: HttpCommunicationService) {}

    fetchUserById(id: string) {
        return this.communicationService.basicGet<AppUser>(`${USER_API_PATH}/${id}`);
    }

    createUser(user: UserBaseInfo) {
        return this.communicationService.basicPost<Partial<AppUser>, AppUser>(USER_API_PATH, user);
    }

    joinChatById(userId: string, chatId: string) {
        return this.communicationService.basicPatch<null, AppUser>(`${USER_API_PATH}/${userId}/chat/${chatId}`, null);
    }

    leaveChatById(userId: string, chatId: string) {
        return this.communicationService.basicDelete<AppUser>(`${USER_API_PATH}/${userId}/chat/${chatId}`);
    }

    changeSelectedTheme(userId: string, themeUrl: string) {
        return this.communicationService.basicPut<{ themeUrl: string }, AppUser>(`${USER_API_PATH}/${userId}/theme`, { themeUrl });
    }

    changeSelectedAvatar(userId: string, avatarUrl: string) {
        return this.communicationService.basicPut<{ avatarUrl: string }, AppUser>(`${USER_API_PATH}/${userId}/avatar`, { avatarUrl });
    }

    changeSelectedSound(userId: string, soundUrl: string) {
        return this.communicationService.basicPut<{ soundUrl: string }, AppUser>(`${USER_API_PATH}/${userId}/sound`, { soundUrl });
    }

    updateUsername(userId: string, name: string) {
        return this.communicationService.basicPatch<{ name: string }, AppUser>(`${USER_API_PATH}/${userId}/username`, { name });
    }

    isUserAlreadyConnected(email: string) {
        return this.communicationService.basicGet<boolean>(`${USER_API_PATH}/connected/${email}`);
    }
}
