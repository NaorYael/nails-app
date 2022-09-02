import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from "../../shared/User";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsernameComponent} from "../components/username/username.component";

@Injectable({providedIn: 'root'})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  login(user: User) {
    console.log(user);
    if (!user.username) {
      let dialogRef: MatDialogRef<UsernameComponent>;
      dialogRef = this.dialog.open(UsernameComponent);
      dialogRef.componentInstance.user = this.user.value;
      dialogRef.afterClosed();
    } else if (user.password !== '') {
      this.loggedIn.next(true);
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
