import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent{

  public title = '';
  public message = '';

  constructor(public dialogRef: MatDialogRef<DialogComponent>) {
  }

}
