import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../shared/entities/User';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UsernameModalComponent} from '../components/username-modal/username-modal.component';
import {Remult} from 'remult';
import {JwtHelperService} from '@auth0/angular-jwt'
import {UserController} from '../../shared/controllers/UserController'
import {SessionStorageService} from '../services/session-storage.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());

  private userController = new UserController(this.remult);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get user(): User {
    return this._user.value;
  }

  setUser(user: any) {
    this._user.next(user);
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
    this._user.next(userDetails);
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
    if (!(await this.user.username)) {
      this.updateUsernameIfNotExists();
      this.setUserOnControllerAndSessionStorage();
      const token = await this.userController.signIn();
      if (token) {
        this.setAuthToken(token);
        this.loggedIn.next(true);
        await this.router.navigate(['/']);
        return token;
      }
    } else if (this.user.password !== '') {
      this.setUserOnControllerAndSessionStorage();
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
    this._user.next({...this.user, password: ''} as User)
    let userRepo = this.remult.repo(User);
    await userRepo.save(this.user);
    this.setAuthToken(null);
    this.sessionStorage.clearAll()
  }

  private updateUsernameIfNotExists() {
    let dialogRef: MatDialogRef<UsernameModalComponent>;
    dialogRef = this.dialog.open(UsernameModalComponent);
    dialogRef.componentInstance.user = this.user;
    dialogRef.afterClosed();
  }

  private setUserOnControllerAndSessionStorage() {
    this.userController.user = this.user;
    this.sessionStorage.setUserDetails(this.user)
  }
}
