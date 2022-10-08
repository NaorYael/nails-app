import {Component} from '@angular/core';
import {AuthService} from "../../otp-auth/auth.service";
import {User} from "../../../shared/User";
import {BehaviorSubject} from "rxjs";
import {Remult} from 'remult'
import {Roles} from '../../models/roles'
import {EventsController} from "../../../shared/EventsController";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  user: BehaviorSubject<User> = this.authService.user;
  eventController = new EventsController(this.remult);

  constructor(public authService: AuthService,
              private remult: Remult) {
  }

  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  logout() {
    this.authService.logout();
  }


  async sync() {
    await this.eventController.syncEvents();
  }
}
