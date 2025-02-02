import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private auth: Auth) {}

  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return userCredential.user;
  }

  async signOut(): Promise<void> {
    return this.auth.signOut();
  }

  async createUser(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return userCredential.user;
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  getUserId(): string | null {
    const user = this.auth.currentUser;
    if (user) {
      return user.uid;
    }
    return null;
  }

  getEmail(): string | null {
    const user = this.auth.currentUser;
    if (user) {
      return user.email;
    }
    return null;
  }
}
