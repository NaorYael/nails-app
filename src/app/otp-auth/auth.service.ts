import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from "../../shared/User";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsernameModalComponent} from "../components/username-modal/username-modal.component";
import {Remult} from "remult";
import {JwtHelperService} from '@auth0/angular-jwt'
import {UserController} from '../../shared/UserController'
import {SessionStorageService} from "../services/session-storage.service";

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
    private sessionStorage: SessionStorageService,
    private dialog: MatDialog
  ) {
    const token = AuthService.fromStorage();
    if (token) {
      this.setAuthToken(token);
      this.loggedIn.next(true);
      this.router.navigate(['/']);
    }
    const userDetails = this.sessionStorage.getUserDetails();
      this.user.next(userDetails);
  }

  static fromStorage(): string {
    return SessionStorageService.getToken();
  }

  // Passes the decoded user information to Remult and stores the token in the local sessionStorage.
  setAuthToken(token: string | null) {
    if (token) {
      this.remult.setUser(new JwtHelperService().decodeToken(token));
      this.sessionStorage.setToken(token);
    } else {
      this.remult.setUser(undefined!);
      this.sessionStorage.clearToken();
    }
  }

  async login() {
    if ( !(await this.user.value.username)) {
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
    this.sessionStorage.clearAll()
  }

  private updateUsernameIfNotExists() {
    let dialogRef: MatDialogRef<UsernameModalComponent>;
    dialogRef = this.dialog.open(UsernameModalComponent);
    dialogRef.componentInstance.user = this.user.value;
    dialogRef.afterClosed();
  }

  private setUser() {
    this.userController.user = this.user.value;
    this.sessionStorage.setUserDetails(this.user.value)

  }
}
