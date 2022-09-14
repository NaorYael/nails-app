import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from "../../shared/User";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsernameComponent} from "../components/username/username.component";
import {Remult} from "remult";
import {JwtHelperService} from '@auth0/angular-jwt'
import {UserController} from '../../shared/UserController'

const AUTH_TOKEN_KEY = "authToken";

@Injectable({providedIn: 'root'})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  userController = new UserController(this.remult);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private remult: Remult,
    private dialog: MatDialog
  ) {
    const token = AuthService.fromStorage();
    if (token) {
      this.setAuthToken(token);
      this.loggedIn.next(true);
      this.router.navigate(['/']);
    }
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      this.user.next(JSON.parse(userDetails));
    }
  }

  static fromStorage(): string {
    return sessionStorage.getItem(AUTH_TOKEN_KEY)!;
  }

  // Passes the decoded user information to Remult and stores the token in the local sessionStorage.
  setAuthToken(token: string | null) {
    if (token) {
      this.remult.setUser(new JwtHelperService().decodeToken(token));
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      this.remult.setUser(undefined!);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  async login() {
    if ( (!await this.user.value.username)) {
      this.updateUsernameIfNotExists();
      this.setUser();
      const token = await this.userController.signIn();
      if (token) {
        this.setAuthToken(token);
        this.loggedIn.next(true);
        await this.router.navigate(['/']);
        return token;
      }
    } else if (this.user.value.password !== '') {
      this.setUser();
      const token = await this.userController.signIn();
      if (token) {
        this.setAuthToken(token);
        this.loggedIn.next(true);
        await this.router.navigate(['/']);
        return token;
      }
    }
    return null;
  }

  async logout() {
    this.loggedIn.next(false);
    await this.router.navigate(['/login']);
    this.user.value.password = '';
    let userRepo = this.remult.repo(User);
    await userRepo.save(this.user.value);
    this.setAuthToken(null);
    sessionStorage.clear();
  }

  private updateUsernameIfNotExists() {
    let dialogRef: MatDialogRef<UsernameComponent>;
    dialogRef = this.dialog.open(UsernameComponent);
    dialogRef.componentInstance.user = this.user.value;
    dialogRef.afterClosed();
  }

  private setUser() {
    this.userController.user = this.user.value;
    sessionStorage.setItem('userDetails', JSON.stringify(this.user.value));
  }
}
