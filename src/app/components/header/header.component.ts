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

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userDetails')!);
  }

  logout() {
    this.authService.logout();
  }


}
