import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {User} from "../../../shared/entities/User";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../otp-auth/auth.service";
import {Remult} from "remult";
import {Router} from "@angular/router";
import {SessionStorageService} from "../../services/session-storage.service";

@Component({
  selector: 'app-username-modal',
  templateUrl: './username-modal.component.html',
  styleUrls: ['./username-modal.component.scss']
})
export class UsernameModalComponent {

  public user!: User;
  form = this.fb.group({
    username: ''
  });

  constructor(public dialogRef: MatDialogRef<UsernameModalComponent>,
              private fb: FormBuilder,
              private router: Router,
              private sessionStorage: SessionStorageService,
              private authService: AuthService,
              private remult: Remult) {
  }

  async onSubmit() {
    if (this.form.valid) {
      this.user = {...this.user, ...this.form.value} as User;
      let userFromDB = this.remult.repo(User);
      this.authService.setUser(await userFromDB.save(this.user));
      this.sessionStorage.setUserDetails(this.user);
      this.dialogRef.close();
    }
  }
}
