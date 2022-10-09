import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {MatDialog} from '@angular/material/dialog'
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'
import {MatStepper} from '@angular/material/stepper'
import {DateAdapter} from '@angular/material/core'
import {MatDatepicker} from '@angular/material/datepicker'
import {Event} from '../../../shared/entities/Event';
import {Remult} from 'remult'
import {EventsController} from '../../../shared/controllers/EventsController'
import {WorkHourService} from '../../services/work-hour.service'
import {AuthService} from "../../otp-auth/auth.service";
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {DialogService} from "../../common/dialog/dialog.service";
import {WorkHoursManagement} from "../../../shared/entities/WorkHoursManagement";
import {SessionStorageService} from "../../services/session-storage.service";
import {User} from "../../../shared/entities/User";

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
  message = 'טעינה...'

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  loading = true;

  errMsg = '';

  @ViewChild('stepper')
  stepper!: MatStepper;

  @ViewChild(MatDatepicker)
  picker!: MatDatepicker<Moment>;

  minDate = new Date();
  private eventsPerMonth: Event[] = [];
  private workHourManagement!: WorkHoursManagement;
  availableAppointmentsForSelectedDate: Array<number> = [];


  constructor(private dialog: MatDialog,
              private dateAdapter: DateAdapter<any>,
              private dialogService: DialogService,
              public remult: Remult,
              private sessionStorage: SessionStorageService,
              private workHourService: WorkHourService,
              public authService: AuthService) {
  }


  async ngOnInit() {
    // await this.getEventsFromGoogleCalender();
    this.minDate = new Date();

    this.dateAdapter.setLocale('he');

    // this.setInitWorkHoursAndBreak();

    this.eventsPerMonth = await this.eventController.getEventsByMonth(new Date().getMonth());
    this.workHourManagement = this.workHourService.getWorkHour().value;

    // this.extractAvailableWorkHours()s
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
      this.stepper.selectedIndex = 1;
      this.isEventSelected = false;
    }
    setTimeout(() => {
      this.stepper.linear = true;
    });
  }

  private extractAvailableWorkHours() {
    this.workHourManagement.workHours.forEach(whm => {
      const day = this.selectedDate.getDay();
      if (day === whm.dayInTheWeek) {
        const startDay = whm.timeRange.startTime;
        const endDay = whm.timeRange.endTime;
        const careTimeLength = this.workHourManagement.careTimeLength;

        if (startDay && endDay && careTimeLength) {
          const startDayDate = new Date(this.selectedDate);
          startDayDate.setHours(startDay);
          const endDayDate = new Date(this.selectedDate);
          endDayDate.setHours(endDay);
          const endDayMillis = endDayDate.getTime();
          const startDayMills = startDayDate.getTime();
          // const promoteToNextAppointment(i: number, careTimeLength: number) => {
          //   return new Date(i).setHours(new Date(i).getHours() + careTimeLength);
          // }
          for (let i = startDayMills; i < endDayMillis; i = new Date(i).setHours(new Date(i).getHours() + careTimeLength)) {
            const index = this.eventsPerMonth.findIndex(e => e.id === i);
            if (index === -1) {
              this.availableAppointmentsForSelectedDate.push(new Date(i).getHours())
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

  onSelectDate(event: any) {
    this.availableAppointmentsForSelectedDate = [];
    this.selectedDate = event.value;
    this.extractAvailableWorkHours();
  }

  async onSelectTime(hour: number) {
    this.isEventSelected = true;
    this.selectedDate.setHours(hour);
    this.event.id = this.selectedDate.getTime();
    // this.appointmentArr.push(this.event);
    this.extractAvailableWorkHours();
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

    // this.loading = true;
    const user = this.sessionStorage.getUserDetails();

    const selectedDateEnd = this.formatEndDate();

    const calendarId = await this.createEventOnGoggleCalendar(user, selectedDateEnd);

    await this.updateEvent(user, calendarId);

    // TODO implement sms logic
    // const msg = 'פגישה נקבע בתאריך';
    // await sendSms(user.phone, msg)

    // this.loading = false;
    this.dialogService.alert('פגישה נקבעה בהצלחה', 'פרטים נוספים נשלחו בהודעת sms', 'done')
      .pipe(untilDestroyed(this))
      .subscribe(res => console.log(res))
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
    })

    await this.event.save();
  }

  private parseDateToStr(date: Date): string {
    const momObj = moment(date);
    return momObj.format('DD/MM/YYYY');
  }

  async onReset() {
    // this.appointmentArr = [];
    // this.availableAppointmentsForSelectedDate = [];
    // this.extractAvailableWorkHours();
    this.picker.select(undefined!)
    this.showEventTimes = false;
    this.isEventSelected = false
    this.dateToString = '';
    this.hideHourLabel = false;
    this.stepper.selectedIndex = 0;
    // window.location.reload();
  }

  onCalendarAdd() {
    this.dialogService.alert('דף לא זמין', 'עדיין עובדים על זה :)', 'info')
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
