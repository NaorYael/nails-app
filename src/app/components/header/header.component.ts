import {Component} from '@angular/core';
import {AuthService} from "../../otp/auth.service";
import {User} from "../../../shared/User";
import {BehaviorSubject, distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  user: BehaviorSubject<User> = this.authService.user;

  constructor(public authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }


}
