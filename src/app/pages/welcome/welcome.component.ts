import {Component} from '@angular/core';
import {AuthService} from '../../otp-auth/auth.service';
import {Observable} from 'rxjs';
import {Event} from '../../../shared/entities/Event';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  nextEvent: Observable<Event> = this.auth.nextEvent;

  imageSource = '../../../assets/logo.jpeg';
  imageLoad = false;
  message = 'טעינה...';
  noIncomingAppointment = '...לא נמצאו פגישות';
  noIncomingAppointmentDesc = 'לקביעת פגישה יש ללחוץ למטה על "פגישה חדשה".'

  onLoadImage() {
    this.imageLoad = true;
  }

  constructor(private auth: AuthService) {
  }

  convertMilliSecondsToDayNumber(id: number): number {
    let date = new Date(id);
    return date.getDay();
  }
}
