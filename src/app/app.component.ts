import {Component, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {filter, Observable, Subscription, switchMap} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy'
import {Remult} from 'remult';
import {WorkHoursManagement} from '../shared/entities/WorkHoursManagement';
import {WorkHourService} from './services/work-hour.service';
import {AuthService} from './otp-auth/auth.service';
import {EventsController} from '../shared/controllers/EventsController';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private media: MediaObserver,
              private hoursService: WorkHourService,
              private authService: AuthService,
              private remult: Remult) {
    this.media$ = this.media.asObservable();
  }

  isMobileMode = false;
  media$!: Observable<MediaChange[]>;
  private mediaSubscription!: Subscription;

  async ngOnInit(): Promise<void> {
    this.mediaSubscription = this.media$.pipe(
      untilDestroyed(this)).subscribe(item => {
      this.handleMobileMode(item)
    })
    this.extractWorkHoursAndNextAppointment();
  }

  private extractWorkHoursAndNextAppointment() {

    this.authService.isLoggedIn
      .pipe(
        filter((isLoggedIn: boolean) => isLoggedIn),
        switchMap(async () => {
          const workHoursManRepo = this.remult.repo(WorkHoursManagement);
          const eventController = new EventsController(this.remult);
          return {
            workHoursManagement: await workHoursManRepo.findFirst(),
            nextEvent: await eventController.getNextEventOfUser(this.authService.user.phone!)
          };
        }))
      .pipe(
        untilDestroyed(this))
      .subscribe(async (data) => {
        await this.hoursService.setWorkHour(data.workHoursManagement);
        this.authService.setNextEvent(data.nextEvent)
      });
  }

  private handleMobileMode(item: MediaChange[]) {
    if (item[0]['mqAlias'] !== 'xs') {
      this.isMobileMode = false;
    } else if (item[0]['mqAlias'] === 'xs') {
      this.isMobileMode = true;
    }
  }
}
