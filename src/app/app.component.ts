import {Component, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {filter, Observable, Subscription, switchMap} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy'
import {Remult} from 'remult';
import {WorkHoursManagement} from '../shared/entities/WorkHoursManagement';
import {WorkHourService} from './services/work-hour.service';
import {AuthService} from './otp-auth/auth.service';

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
    this.extractWorkHours();
  }

  private extractWorkHours() {
    this.authService.isLoggedIn
      .pipe(
        filter((isLoggedIn: boolean) => isLoggedIn),
        switchMap(async () => {
          const workHoursManRepo = this.remult.repo(WorkHoursManagement);
          return await workHoursManRepo.findFirst()
        })).pipe(
      untilDestroyed(this))
      .subscribe(async (workHoursManagement: WorkHoursManagement) => {
      await this.hoursService.setWorkHour(workHoursManagement)
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
