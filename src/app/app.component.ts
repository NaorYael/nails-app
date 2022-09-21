import {Component, OnDestroy, OnInit} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Observable, Subscription} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private media: MediaObserver) {
    this.media$ = this.media.asObservable();
  }

  isMobileMode = false;
  media$!: Observable<MediaChange[]>;
  private mediaSubscription!: Subscription;

  ngOnInit(): void {
    this.mediaSubscription = this.media$.pipe(
      untilDestroyed(this)).subscribe(item => {
      this.handleMobileMode(item)
    })
  }

  private handleMobileMode(item: MediaChange[]) {
    if (item[0]['mqAlias'] !== 'xs') {
      this.isMobileMode = false;
    } else if (item[0]['mqAlias'] === 'xs') {
      this.isMobileMode = true;
    }
  }
}
