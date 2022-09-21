import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {WorkHourService} from '../../services/work-hour.service'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  // @Output() handleNext: EventEmitter<number> = new EventEmitter<number>();
  //
  // isEventSelected = false;
  // subscriptionArr: Subscription[] = [];

  constructor(private eventService: WorkHourService) {
  }

  ngOnInit(): void {
    // this.isEventSelected = false
    // this.subscriptionArr.push(this.eventService.selectedEvent$.subscribe((value) => {
    //   this.isEventSelected = value;
    // }));

  }

  ngOnDestroy(): void {
    // this.subscriptionArr.forEach(x => x.unsubscribe())
  }


  handleNextStep() {
    // this.handleNext.emit();
    // this.isEventSelected = true;
  }
}
