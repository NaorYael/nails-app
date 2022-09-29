import {Injectable} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {DialogComponent} from "./dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {
  }

  public alert(title: string, message: string): Observable<boolean> {

    let dialogRef: MatDialogRef<DialogComponent>;

    dialogRef = this.dialog.open(DialogComponent);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
}
