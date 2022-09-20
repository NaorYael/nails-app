import { Component, OnInit } from '@angular/core';
import {User} from '../../../shared/User'
import {MatDialog, MatDialogRef} from '@angular/material/dialog'
import {PopupComponent} from '../../components/popup/popup.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  imageSource = '../../../assets/logo.jpeg';
  imageLoad = false;
  message = 'טעינה...'

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  user!: User;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userDetails')!);
  }

  onLoadImage() {
   this.imageLoad = true;
  }

  openModal() {
    let dialogRef: MatDialogRef<PopupComponent>;
    dialogRef = this.dialog.open(PopupComponent);
    // dialogRef.componentInstance.user = this.user;
    return dialogRef.afterClosed();
  }
}
