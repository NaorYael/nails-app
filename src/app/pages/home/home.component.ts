import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {MatDialog, MatDialogRef} from '@angular/material/dialog'
import {FormBuilder, FormGroup} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'
import {MatStepper} from '@angular/material/stepper'
import {DateAdapter} from '@angular/material/core'
import {MatDatepicker} from '@angular/material/datepicker'
import {Event} from '../../../shared/Event';
import {Remult} from 'remult'
import {MatSnackBar} from '@angular/material/snack-bar'
import {EventsController} from '../../../shared/EventsController'
import {PopupComponent} from '../../components/popup/popup.component'
import {Subscription} from 'rxjs'
import {EventService} from '../../services/event.service'
import {Router} from '@angular/router'
import {AuthService} from "../../otp/auth.service";

export interface WorkHours {
  blanks: Array<TimeRange>;
  hours: TimeRange;
}

export interface TimeRange {
  startTime: Date;
  endTime: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class HomeComponent implements OnInit, OnDestroy {

  dateToString = '';
  event!: Event;
  selectedDate = new Date();
  eventController = new EventsController(this.remult);

  eventsTimeArr: Array<number> = [];
  startTime!: number;
  endTime!: number;
  workHours!: WorkHours;
  appointmentArr: Array<Event> = [];
  completed: boolean = false;

  isEventSelected: boolean = false;
  showEventTimes: boolean = false;
  state = '';

  selectedValue = '';

  eventToDisplay!: Event;

  subscriptionArr: Subscription[] = [];
  index!: number

  done() {
    this.completed = true;
    this.completed = true;
    this.state = 'done';
    console.log(this.firstFormGroup.valid);
    console.log(this.secondFormGroup.valid);
  }

  @ViewChild('stepper')
  stepper!: MatStepper;

  @ViewChild(MatDatepicker)
  picker!: MatDatepicker<Moment>;


  async handleNextStep() {
    this.stepper.linear = false;
    if (this.stepper.selectedIndex === 1) {
      this.stepper.selectedIndex = 2;
    } else if (this.stepper.selectedIndex === 2) {
      this.done();
      this.onReset();
    } else {
      this.stepper.selectedIndex = 1;
      this.isEventSelected = false;
    }
    setTimeout(() => {
      this.stepper.linear = true;
    });
  }

  handleSelectedEvent(event: any) {
    this.isEventSelected = true;
    this.eventToDisplay = event;
  }

  constructor(private dialog: MatDialog,
              private dateAdapter: DateAdapter<any>,
              private snake: MatSnackBar,
              public remult: Remult,
              private router: Router,
              private eventService: EventService,
              public authService: AuthService,
              private fb: FormBuilder) {
  }

  firstFormGroup: FormGroup = this.fb.group({firstCtrl: ['']});
  secondFormGroup: FormGroup = this.fb.group({secondCtrl: ['']});
  errMsg = '';

  async ngOnInit() {

    this.dateAdapter.setLocale('he');

    this.setInitWorkHoursAndBreak();
    this.extractAvailableWorkHours();
  }

  private extractAvailableWorkHours() {
    this.eventsTimeArr = [];
    this.startTime = this.workHours.hours.startTime.getHours();
    this.endTime = this.workHours.hours.endTime.getHours();

    for (let i = this.startTime; i < this.endTime; i += 2) {
      this.workHours.blanks.forEach(y => {
        if (i < y.startTime.getHours() || i > y.endTime.getHours()) {
          if (this.appointmentArr.length > 0) {

            this.appointmentArr.forEach(event => {
              const date = new Date(this.selectedDate);
              date.setHours(i);
              if (event.id !== date.getTime()) {
                this.addEvents(i);
              }
            })
          } else {
            this.addEvents(i);
          }
        }
      })
    }
  }

  private addEvents(i: number) {
    const date = new Date().setHours(i, 0, 0, 0)
    this.eventsTimeArr.push(date);
  }

  private setInitWorkHoursAndBreak() {
    const startTime = new Date();
    const endTime = new Date();
    this.setHourOnDate(startTime, 9);
    this.setHourOnDate(endTime, 19);

    const breakStartTime = new Date();
    const breakEndTime = new Date();
    this.setHourOnDate(breakStartTime, 13);
    this.setHourOnDate(breakEndTime, 16);

    this.workHours = {hours: {startTime, endTime}, blanks: [{startTime: breakStartTime, endTime: breakEndTime}]}
  }

  private setHourOnDate(date: Date, hour: number) {
    date.setHours(hour, 0, 0, 0);
  }

  onSelectDate(event: any) {
    this.selectedDate = event.value;
    this.extractAvailableWorkHours();
    this.showEventTimes = true;
  }

  async onSelectTime(event: number) {
    this.selectedDate.setHours(new Date(event).getHours(), 0, 0, 0);
    this.event = {id: this.selectedDate.getTime()} as Event;
    this.appointmentArr.push(this.event);
    this.extractAvailableWorkHours();
    this.isEventSelected = true;
    this.dateToString = this.parseDateToStr(this.selectedDate);
  }

  async onSubmit() {
    try {
      this.eventController.event = await this.event;
      await this.eventController.createEvent();
      await this.handleNextStep();
      // phone name password
    } catch (e: any) {
      console.error(e);
      this.handleError(e.message);
      this.onReset();
    }

  }


  private parseDateToStr(date: Date): string {
    const momObj = moment(date);
    return momObj.format('DD/MM/YYYY');
  }

  openModal() {
    let dialogRef: MatDialogRef<PopupComponent>;
    dialogRef = this.dialog.open(PopupComponent);
    dialogRef.componentInstance.event = this.event;
    return dialogRef.afterClosed();
  }

  onReset() {
    this.appointmentArr = [];
    this.selectedValue = '';
    this.picker.select(undefined!);
    this.extractAvailableWorkHours();
    this.showEventTimes = false;
    this.isEventSelected = false
    this.dateToString = '';
  }

  private handleError(msg: string) {
    this.snake.open(msg, "סגור", {
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      direction: "rtl"
    });
  }

  ngOnDestroy(): void {
    this.subscriptionArr.forEach(x => x.unsubscribe())
  }
}
