import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service'
import {Router} from '@angular/router'
import {UserController} from "../../../shared/UserController";
import {EventsController} from "../../../shared/EventsController";
import {Remult} from "remult";
import {User} from "../../../shared/User";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  phoneNumber = '';
  private formSubmitAttempt!: boolean;

  userController = new UserController(this.remult);
  user!: User;
  errMsg = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private remult: Remult,
    private snake: MatSnackBar,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      phone: [undefined, [Validators.required]],
    });
  }

  async sendOtp() {
    if (this.form.valid) {
      this.phoneNumber = this.form.value.phone;
      this.user = this.form.value as User;
    } else {
      return;
    }
    // const phone = this.phoneNumber.replace('+972', '0');

    try {
      this.userController.user = await this.user;
      await this.userController.loginOtp().then(() => {
        // if (response.status === 'queued') {
        this.user = this.userController.user;
        this.authService.user.next(this.user);
        this.router.navigate(['/confirm']);
        // }
        // this.handleError(JSON.stringify('error code : ' + response.code))
      });


    } catch (e: any) {
      this.errMsg = e;
      console.error(e.message);
      this.handleError(JSON.stringify(e))
    }
  }

  get phoneValue() {
    return this.form.controls['phone']
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)!.valid && this.form.get(field)!.touched) ||
      (this.form.get(field)!.untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    }
    this.formSubmitAttempt = true;
  }

  private handleError(msg: string) {
    this.snake.open(msg, "סגור", {
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      direction: "rtl"
    });
  }
}
