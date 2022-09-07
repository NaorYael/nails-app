import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../otp/auth.service";
import {User} from "../../../shared/User";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user!: User;

  constructor(public authService: AuthService,) {
  }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user.value;
  }

  logout() {
    this.authService.logout();
  }

}
