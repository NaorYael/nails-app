import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Event} from '../../../shared/Event'
import {User} from '../../../shared/User'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit{

  editUserForm!: FormGroup;
  user!: User;

  constructor(public dialogRef: MatDialogRef<PopupComponent>,
              private fb: FormBuilder) {
  }
  ngOnInit(): void {
     this.fb.group({
      username: [this.user.username, ],
      phone: [this.user.phone, ]
    });
  }

  onSubmit() {
    console.log(this.editUserForm.value)
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}
