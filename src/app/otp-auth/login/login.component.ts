import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service'
import {Router} from '@angular/router'
import {UserController} from "../../../shared/controllers/UserController";
import {Remult} from "remult";
import {User} from "../../../shared/entities/User";
import {DialogService} from "../../common/dialog/dialog.service";


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
    private dialogService: DialogService,
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

    this.userController.user = await this.user;
    await this.userController.loginOtp().then(() => {
      // UserController.sendSMS('1234','טסט');
      // sendSms('0545870318', 'טסט');
      // if (response.status === 'queued') {
      this.user = this.userController.user;
      this.authService.setUser(this.user);
      this.router.navigate(['/confirm']);
      // }
      // this.handleError(JSON.stringify('error code : ' + response.code))
    });

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

  async onSubmit() {
    if (this.form.valid) {
      this.authService.setUser({...this.authService.user, ...this.form.value})
      await this.authService.login();
    }
    this.formSubmitAttempt = true;
  }

}
