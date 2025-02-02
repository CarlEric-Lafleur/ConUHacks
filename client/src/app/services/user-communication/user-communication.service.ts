import { Injectable } from '@angular/core';
import { USER_API_PATH } from '../../constants/communication.service.constants';
import { HttpCommunicationService } from '../http-communication/http-communication.service';
import { AppUser } from '../../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class UserCommunicationService {
    constructor(private communicationService: HttpCommunicationService) {}

    fetchUserById(id: string) {
        return this.communicationService.basicGet<AppUser>(`${USER_API_PATH}/${id}`);
    }

    createUser(user: AppUser) {
        return this.communicationService.basicPost<AppUser, AppUser>(USER_API_PATH, user);
    }

    updateUser(user: AppUser) {
        return this.communicationService.basicPut<AppUser, AppUser>(`${USER_API_PATH}/${user._id}`, user);
    }

    fetchHelpees(email: string){
      return this.communicationService.basicGet<AppUser[]>(`helpees/${email}`)
    }

}
