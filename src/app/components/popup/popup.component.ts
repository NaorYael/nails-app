import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Event} from '../../../shared/Event'
import {User} from '../../../shared/User'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Remult} from 'remult'
import {Roles} from '../../../shared/Roles'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  form!: FormGroup;

  time = new Date();

  change($event: any) {
    console.log($event);
    this.time = $event;
  }

  close() {
    console.warn('close');
  }

  constructor(public dialogRef: MatDialogRef<PopupComponent>,
              private remult: Remult,
              private fb: FormBuilder) {
  }

  isAdmin() {
    // return this.remult.isAllowed(Roles.admin);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      day: ['', Validators.required],
      time: ['',Validators.required]
    });
  }

  onSubmit() {
    // if (this.isAdmin()) {
    //   console.log('admin');
    // }
    console.log(this.form.value)
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}
