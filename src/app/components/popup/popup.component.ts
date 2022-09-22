import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Event} from '../../../shared/Event'
import {User} from '../../../shared/User'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Remult} from 'remult'

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


  ngOnInit(): void {
    this.form = this.fb.group({
      day: ['', Validators.required],
      time: ['',Validators.required]
    });
  }

  onSubmit() {
    console.log(this.form.value)
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}
