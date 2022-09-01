import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Remult} from "remult";
import {User} from "../../../shared/User";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  code: string = '';

  constructor(private authService: AuthService,
              private snake: MatSnackBar,
              private remult: Remult) { }

  ngOnInit(): void {
  }

  // this called every time when user changed the code
  onCodeChanged(code: string) {
    console.log('Changed',code)
    this.code = code;
  }

  // this called only if user entered full code
 async onCodeCompleted(code: string) {
    const userRepo = this.remult.repo(User);
    for(let user of await userRepo.find()) {
      console.log(user.password);
      console.log(code);
      if (user.password === code) {
        this.authService.login(user);
      } else {
        this.snake.open('קוד לא תקין', "סגור", {
          duration: 5000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
          direction: "rtl"
        });
      }
    }
  }

}
