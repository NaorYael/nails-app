import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Remult} from "remult";
import {User} from "../../../shared/User";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserController} from '../../../shared/UserController'

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  code: number = 0;
  userController = new UserController(this.remult);

  constructor(private authService: AuthService,
              private snake: MatSnackBar,
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
      this.authService.user.next({...this.authService.user.value, password: String(this.code)} as User);
      await this.authService.login();

  }

  private loginFailedMsg() {
    this.snake.open('קוד לא תקין', "סגור", {
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      direction: "rtl"
    });
  }
}
