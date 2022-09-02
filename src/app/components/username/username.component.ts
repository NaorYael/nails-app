import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {User} from "../../../shared/User";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../otp/auth.service";
import {Remult} from "remult";

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent {

  public user!: User;
  form = this.fb.group({
    username: ''
  });

  constructor(public dialogRef: MatDialogRef<UsernameComponent>,
              private fb: FormBuilder,
              private authService: AuthService,
              private remult: Remult) {
  }

  async onSubmit() {
    if (this.form.valid) {
      this.user = {...this.user, ...this.form.value} as User;
      let userRepo = this.remult.repo(User);
      let user = await userRepo.save(this.user);
      this.authService.user.next(user);
      this.dialogRef.close();
    }
  }
}
