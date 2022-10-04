import {Component, OnDestroy, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Observable, Subscription} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy'
import {Remult} from "remult";
import {WorkHoursManagement} from "../shared/WorkHoursManagement";
import {WorkHourService} from "./services/work-hour.service";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private media: MediaObserver,
              private service: WorkHourService,
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

    const workHoursManRepo = this.remult.repo(WorkHoursManagement);
    this.service.setWorkHour(await workHoursManRepo.findFirst());
  }

  private handleMobileMode(item: MediaChange[]) {
    if (item[0]['mqAlias'] !== 'xs') {
      this.isMobileMode = false;
    } else if (item[0]['mqAlias'] === 'xs') {
      this.isMobileMode = true;
    }
  }
}
