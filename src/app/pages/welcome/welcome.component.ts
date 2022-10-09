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

  constructor(private auth: AuthService) {
  }
}
