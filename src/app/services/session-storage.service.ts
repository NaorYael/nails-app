import {Injectable} from '@angular/core';
import {User} from '../../shared/entities/User';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private readonly USER_DETAILS = 'userDetails';
  private static readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly AUTH_TOKEN_KEY = 'authToken';

  isUserDetailsExists(): boolean {
    return this.isNotEmptyAndNotUndefined(this.getUserDetails());
  }

  getUserDetails(): User {
    return JSON.parse(sessionStorage.getItem(this.USER_DETAILS)!) as User;
  }

  setUserDetails(user: User): void {
    if (this.isUserDetailsExists()) {
      this.updateUserDetails(user);
    } else {
      sessionStorage.setItem(this.USER_DETAILS, JSON.stringify(user));
    }
  }

  clearUserDetails() {
    return sessionStorage.removeItem(this.USER_DETAILS);
  }

  updateUserDetails(user: User) {
    if (this.isUserDetailsExists()) {
      const u = {...this.getUserDetails(), ...user} as User;
      this.clearUserDetails();
      this.setUserDetails(u);
    } else {
      this.setUserDetails(user);
    }
  }

  isTokenExists(): boolean {
    return this.isNotEmptyAndNotUndefined(this.getToken());
  }

  static getToken(): string {
    return JSON.parse(sessionStorage.getItem(this.AUTH_TOKEN_KEY)!);
  }

  getToken(): string {
    return JSON.parse(sessionStorage.getItem(this.AUTH_TOKEN_KEY)!);
  }

  setToken(token: string): void {
    if (this.isTokenExists()) {
      this.updateToken(token);
    } else {
      sessionStorage.setItem(this.AUTH_TOKEN_KEY, JSON.stringify(token));
    }
  }

  clearToken() {
    return sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  updateToken(token: string) {
    if (this.isTokenExists()) {
      this.clearToken();
    }
    this.setToken(token);
  }

  clearAll() {
    return sessionStorage.clear();
  }

  private isNotEmptyAndNotUndefined(obj: Object) {
    return obj !== {} && !!obj;
  }
}
