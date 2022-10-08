import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/User'
import {MatDialog} from '@angular/material/dialog'
import {SessionStorageService} from "../../services/session-storage.service";

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

  constructor(
    private sessionStorage: SessionStorageService,) {
  }

  ngOnInit(): void {
    this.user = this.sessionStorage.getUserDetails();
  }

  onLoadImage() {
    this.imageLoad = true;
  }
}
