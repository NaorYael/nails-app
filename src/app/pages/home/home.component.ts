import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {MatDialog} from '@angular/material/dialog'
import {FormBuilder, FormGroup} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'
import {MatStepper} from '@angular/material/stepper'
import {DateAdapter} from '@angular/material/core'
import {MatDatepicker} from '@angular/material/datepicker'
import {Event} from '../../../shared/Event';
import {Remult} from 'remult'
import {EventsController} from '../../../shared/EventsController'
import {Subscription} from 'rxjs'
import {EventService} from '../../services/event.service'
import {Router} from '@angular/router'
import {AuthService} from "../../otp/auth.service";
import {HotToastService} from "@ngneat/hot-toast";

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
  event = this.remult.repo(Event).create();
  selectedDate = new Date();
  eventController = new EventsController(this.remult);

  eventsTimeArr: Array<number> = [];
  startTime!: number;
  endTime!: number;
  workHours!: WorkHours;
  appointmentArr: Array<Event> = [];
  completed: boolean = false;

  isEventSelected: boolean = false;
  hideHourLabel: boolean = false;
  showEventTimes: boolean = false;
  state = '';

  eventToDisplay!: Event;

  subscriptionArr: Subscription[] = [];
  index!: number

  imageSource = '../../../assets/logo.jpeg';
  imageLoad = false;
  message = 'טעינה...'

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  loading = true;

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

  minDate = new Date();

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday from being selected.
    return day !== 6;
  };

  async handleNextStep() {
    this.stepper.linear = false;
    if (this.stepper.selectedIndex === 1) {
      this.hideHourLabel = true;
      this.stepper.selectedIndex = 2;
    } else {
      this.stepper.selectedIndex = 1;
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
              private toast: HotToastService,
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
    await this.getEventsFromGoogleCalender();
    this.minDate = new Date();

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
    this.event.id = this.selectedDate.getTime();
    this.appointmentArr.push(this.event);
    this.extractAvailableWorkHours();
    this.isEventSelected = true;
    this.dateToString = this.parseDateToStr(this.selectedDate);
    await this.handleNextStep();
  }

  async onSubmit() {
    try {
     // this.loading = true;
      const user = this.getUserFromSessionStorage();

      const selectedDateEnd = this.formatEndDate();

      const calendarId = await this.createEventOnGoggleCalendar(user, selectedDateEnd);

      await this.updateEvent(user, calendarId);

      //this.loading = false;
    } catch (e: any) {
      console.error(e);
      this.handleError(e.message);
      //this.loading = false;
      // await this.onReset();
    }


  }

  private formatEndDate() {
    return moment(this.selectedDate).add(2, 'hours');
  }

  private getUserFromSessionStorage() {
    const userDetails = sessionStorage.getItem('userDetails');
    return JSON.parse(userDetails!);
  }

  private async createEventOnGoggleCalendar(user: any, selectedDateEnd: moment.Moment) {
    return await this.eventController.createEventOnGoggleCalendar({
      ...this.eventToDisplay,
      'username': user?.username,
      'phone': user?.phone.replace('+972', '0'),
      'startDate': this.selectedDate,
      'endDate': selectedDateEnd
    });
  }

  private async updateEvent(user: { phone: string; username: string; }, result: any) {
    this.event.assign({
      phone: user.phone,
      username: user.username,
      calendarId: result
    })

    await this.event.save();
  }

  private parseDateToStr(date: Date): string {
    const momObj = moment(date);
    return momObj.format('DD/MM/YYYY');
  }


  async onReset() {
    this.appointmentArr = [];
    this.picker.select(undefined!);
    this.extractAvailableWorkHours();
    this.showEventTimes = false;
    this.isEventSelected = false
    this.dateToString = '';
    this.hideHourLabel = false;
    this.stepper.selectedIndex = 0;
    window.location.reload();
  }

  private handleError(msg: string) {
    this.toast.error(msg, {
      duration: 5000,
      position: "top-center"
    });
  }


  onLoadImage() {
    this.imageLoad = true;
  }


  ngOnDestroy(): void {
    this.subscriptionArr.forEach(x => x.unsubscribe())
  }

  onCalendarAdd() {
    this.toast.info('עדיין עובדים על זה :)', {
      duration: 3000,
      // style: {
      //   border: '1px solid #713200',
      //   padding: '16px',
      //   color: '#713200',
      // },
    });
  }

  async getEventsFromGoogleCalender() {
    // const eventsFromDB = await this.remult.repo(Event).find();
    // console.log(eventsFromDB);
    // try {
    //   const events = await this.eventController.getEventsFromGoggleCalendar();
    //   console.log(events);
    // } catch (e) {
    //   console.log(e)
    //   // }
    // }
  }
}
