import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Remult} from "remult";
import {User} from "../../../shared/entities/User";
import {UserController} from '../../../shared/controllers/UserController'

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  code: number = 0;
  userController = new UserController(this.remult);

  constructor(public authService: AuthService,
              private remult: Remult) {
  }

  ngOnInit(): void {
  }

  onCodeChanged(code: string) {
    this.code = +code;
  }

  async onCodeCompleted(code: string) {
    // const userRepo = this.remult.repo(User);
    // let user = await userRepo.findId(this.authService.user.value.phone!);
    this.authService.setUser({...this.authService.user, password: String(this.code)} as User);

    await this.authService.login();


  }
}
