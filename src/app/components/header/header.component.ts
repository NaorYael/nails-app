import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../otp/auth.service";
import {Router} from "@angular/router";
import {User} from "../../../shared/User";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user!: User;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.user.value;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login'])
    this.user.password = '';
    this.authService.setAuthToken(null);
  }

}
