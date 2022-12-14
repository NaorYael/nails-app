import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {MatDialog} from '@angular/material/dialog'
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'
import {MatStepper} from '@angular/material/stepper'
import {DateAdapter} from '@angular/material/core'
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker'
import {Event} from '../../../shared/entities/Event';
import {Remult} from 'remult'
import {EventsController} from '../../../shared/controllers/EventsController'
import {WorkHourService} from '../../services/work-hour.service'
import {AuthService} from '../../otp-auth/auth.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {DialogService} from '../../common/dialog/dialog.service';
import {SessionStorageService} from '../../services/session-storage.service';
import {User} from '../../../shared/entities/User';
import {Router} from '@angular/router';
import {sendSms} from "../../../server/sms";
import {finalize} from "rxjs";
import {WorkHoursManagement} from "../../../shared/entities/WorkHoursManagement";
import {UtilsService} from "../../services/utils.service";

@UntilDestroy()
@Component({
  selector: 'app-appointment-scheduling',
  templateUrl: './appointment-scheduling.component.html',
  styleUrls: ['./appointment-scheduling.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class AppointmentSchedulingComponent implements OnInit {

  dateToString = '';
  event = this.remult.repo(Event).create();
  selectedDate = new Date();
  eventController = new EventsController(this.remult);

  // eventsTimeArr: Array<number> = [];
  // startTime!: number;
  // endTime!: number;
  // workHours!: WorkHours;
  appointmentArr: Array<Event> = [];
  completed: boolean = false;

  isEventSelected: boolean = false;
  hideHourLabel: boolean = false;
  showEventTimes: boolean = false;
  state = '';

  selectedEvent!: Event;
  index!: number

  imageSource = '../../../assets/logo.jpeg';
  imageLoad = false;
  message = '??????????...'

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  loading = false;

  errMsg = '';

  @ViewChild('stepper')
  stepper!: MatStepper;

  @ViewChild(MatDatepicker)
  picker!: MatDatepicker<Moment>;

  minDate = new Date();
  private eventsPerMonth: Event[] = [];

  workHourManagement!: WorkHoursManagement;
  availableAppointmentsForSelectedDate: Array<number> = [];
  noHoursAvailable = false;


  constructor(private dialog: MatDialog,
              private dateAdapter: DateAdapter<any>,
              private dialogService: DialogService,
              public remult: Remult,
              private router: Router,
              private sessionStorage: SessionStorageService,
              private workHourService: WorkHourService,
              public authService: AuthService) {
  }


  async ngOnInit() {
    // await this.getEventsFromGoogleCalender();
    this.minDate = new Date();

    this.dateAdapter.setLocale('he');

    await this.isWorkHoursIsEmpty();
    // this.setInitWorkHoursAndBreak();
    // await this.getEventsOnTheMonth();
    // this.extractAvailableWorkHours()s
  }


  private async isWorkHoursIsEmpty() {
    this.workHourManagement = await this.workHourService.getWorkHour().value;
    const isEmpty = UtilsService.isEmptyObject(this.workHourManagement.workHours[0].timeRange);
    if (isEmpty) {
      this.noHoursAvailable = true;
    } else {
      this.noHoursAvailable = false;
    }
  }

  private async getEventsOnTheMonth() {
    this.eventsPerMonth = await this.eventController.getEventsByMonth(this.selectedDate.getMonth());
  }

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
      this.selectedDate = new Date();
      this.stepper.selectedIndex = 1;
      this.isEventSelected = false;
    }
    setTimeout(() => {
      this.stepper.linear = true;
    });
  }

  private async extractAvailableWorkHours() {
    // TODO implements breaks logic
    const workHoursManagement = this.workHourService.getWorkHour().value;
    const day = this.selectedDate.getDay();
    const careTimeLength = workHoursManagement.careTimeLength;

    workHoursManagement.workHours.forEach(whm => {
      if (day === whm.dayInTheWeek) {
        const startDay = whm.timeRange.startTime;
        const endDay = whm.timeRange.endTime;

        if (startDay && endDay && careTimeLength) {
          const startDayDate = new Date(this.selectedDate);
          startDayDate.setHours(startDay);
          const endDayDate = new Date(this.selectedDate);
          endDayDate.setHours(endDay);
          const endDayMillis = endDayDate.getTime();
          const startDayMills = startDayDate.getTime();

          for (let i = startDayMills; i < endDayMillis; i = new Date(i).setHours(new Date(i).getHours() + careTimeLength)) {
            const index = this.eventsPerMonth.findIndex(e => e.id === i);
            if (index === -1) {
              this.availableAppointmentsForSelectedDate.push(new Date(i).getHours());
            }
          }
        }
      }
    });
//    this.workHourManagement.workHours[0].timeRange.startTime;
    this.showEventTimes = true;
  }

  // private addEvents(i: number) {
  //   const date = new Date().setHours(i, 0, 0, 0)
  //   this.eventsTimeArr.push(date);
  // }

  // private setInitWorkHoursAndBreak() {
  //   const startTime = new Date();
  //   const endTime = new Date();
  //   this.setHourOnDate(startTime, 9);
  //   this.setHourOnDate(endTime, 19);
  //
  //   const breakStartTime = new Date();
  //   const breakEndTime = new Date();
  //   this.setHourOnDate(breakStartTime, 13);
  //   this.setHourOnDate(breakEndTime, 16);
  //
  //   this.workHours = {hours: {startTime, endTime}, blanks: [{startTime: breakStartTime, endTime: breakEndTime}]}
  // }

  // private setHourOnDate(date: Date, hour: number) {
  //   date.setHours(hour, 0, 0, 0);
  // }

  async onSelectDate(event: MatDatepickerInputEvent<any>) {
    this.availableAppointmentsForSelectedDate = [];
    this.selectedDate = new Date(event.value);
    await this.getEventsOnTheMonth();
    await this.extractAvailableWorkHours();
  }

  async onSelectTime(hour: number) {
    this.isEventSelected = true;
    this.selectedDate.setHours(hour);
    this.event.id = this.selectedDate.getTime();
    // this.appointmentArr.push(this.event);
    // await this.extractAvailableWorkHours();
    this.dateToString = this.parseDateToStr(this.selectedDate);
    await this.handleNextStep();
  }

  handleSelectedEvent(event: Event) {
    this.isEventSelected = true;
    this.selectedEvent = event;
  }

  async onSubmit() {

    if (!this.event.id) {
      return;
    }

    this.loading = true;
    const user = this.sessionStorage.getUserDetails();

    const selectedDateEnd = this.formatEndDate();

    const calendarId = await this.createEventOnGoggleCalendar(user, selectedDateEnd);

    const event = await this.updateEvent(user, calendarId);
    this.eventsPerMonth.push(event);
    const date = new Date(event.id!);
    const start = this.availableAppointmentsForSelectedDate.findIndex(aafsd => date.getHours() === aafsd);
    this.availableAppointmentsForSelectedDate.splice(start, 1)

    // this.extractAvailableWorkHours();

    this.dialogService.alert('?????????? ?????????? ????????????', '?????????? ???????????? ?????????? ???????????? sms', 'done')
      .pipe(untilDestroyed(this))
      .subscribe(async res => {
        this.loading = false;
      })

    // TODO implement sms with full event details
    // const msg = '?????????? ?????????? ???????? ???? ???? ???????????? 01/01/2022 ???????? 14:00 ???????????? ???????? ???????????? 7 ???????? 8, ?????? ?????????? ???? ?????????? ?????? ?????? ?????? ???????????? ???? ?????? ????????. ';
    // await sendSms(user.phone!, msg);
    this.authService.setNextEvent(event);
    await this.router.navigate(['/welcome']);
    this.loading = false;
  }

  private formatEndDate() {
    return moment(this.selectedDate).add(2, 'hours');
  }

  private async createEventOnGoggleCalendar(user: any, selectedDateEnd: moment.Moment) {
    return await this.eventController.createEventOnGoggleCalendar({
      ...this.selectedEvent,
      'username': user?.username,
      'phone': user?.phone.replace('+972', '0'),
      'startDate': this.selectedDate,
      'endDate': selectedDateEnd
    });
  }

  private async updateEvent(user: User, result: any) {
    this.event.assign({
      phone: user.phone,
      username: user.username,
      calendarId: result,
      completed: true,
      title: this.selectedEvent.title,
      subtitle: this.selectedEvent.subtitle,
      price: this.selectedEvent.price,
      time: this.selectedEvent.time,
    })

    return await this.event.save();
  }

  private parseDateToStr(date: Date): string {
    const momObj = moment(date);
    return momObj.format('DD/MM/YYYY');
  }

  async onReset() {
    // this.appointmentArr = [];
    // this.availableAppointmentsForSelectedDate = [];
    // this.extractAvailableWorkHours();
    // this.picker.select(undefined!)
    this.showEventTimes = false;
    this.isEventSelected = false
    this.dateToString = '';
    this.hideHourLabel = false;
    this.stepper.selectedIndex = 0;
    // window.location.reload();
  }

  onCalendarAdd() {
    this.dialogService.alert('???? ???? ????????', '?????????? ???????????? ???? ???? :)', 'info')
      .pipe(untilDestroyed(this))
      .subscribe(res => console.log(res))
  };

  // async getEventsFromGoogleCalender() {
  //   const eventsFromDB = await this.remult.repo(Event).find();
  //   // console.log(eventsFromDB);
  //     const events = await this.eventController.getEventsFromGoggleCalendar();
  //     // console.log(events);
  //
  // }


  done() {
    this.completed = true;
    this.state = 'done';
    // console.log(this.firstFormGroup.valid);
    // console.log(this.secondFormGroup.valid);
  }
}
