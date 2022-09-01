import {Component, Input} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Event} from '../../../shared/Event'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

 public event!: Event;

  constructor(public dialogRef: MatDialogRef<PopupComponent>) {
  }

  onSubmit() {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}
