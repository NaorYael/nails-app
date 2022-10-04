import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import * as moment from 'moment'
import {WorkHourService} from '../../services/work-hour.service'
import {DailyWorkHours} from '../../../shared/DailyWorkHours'
import {Remult} from 'remult'
import {DialogService} from '../../common/dialog/dialog.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {WorkHoursManagement} from '../../../shared/WorkHoursManagement';

@UntilDestroy()
@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss']
})
export class DaysComponent implements OnInit {

  readonly MINUS_ONE: number = -1;

  selectedDate = new Date();

  // minDate = new Date().setHours(9);
  maxDate = new Date().setHours(19);
  imageLoad = false;
  imageSource = '../../../assets/logo.jpeg';
  confirmBtn: any
  cancelBtn: any

  workHoursManagement!: WorkHoursManagement;

  selectedDays: Array<DailyWorkHours> = [];
  daysDisplay: number[] = [];
  formGroup: FormGroup = this.fb.group({
    'careTimeLength': [this.workHoursManagement?.careTimeLength, Validators.required],
    'start': [null, Validators.required],
    'end': [null, Validators.required]
  });

  constructor(private fb: FormBuilder,
              private dialogService: DialogService,
              private workHourService: WorkHourService,
              private remult: Remult
  ) {
  }

  async ngOnInit() {
    const workHoursManRepo = this.remult.repo(WorkHoursManagement);
    this.workHoursManagement = await workHoursManRepo.findFirst();

    this.careTimeLength.patchValue(this.workHoursManagement.careTimeLength);
  }

//
//   minDate() {
//     const event = new Date('August 19, 1975 23:15:30');
//     event.setHours(20);
//
//     console.log(event);
// // expected output: Tue Aug 19 1975 20:15:30 GMT+0200 (CEST)
// // (note: your timezone may vary)
//
//     event.setHours(20, 21, 22);
//
//     console.log(event);
// // expected output: Tue Aug 19 1975 20:21:22 GMT+0200 (CEST)
//     return event;
//
//   }


  async onSubmit(form: any) {
    if (form.invalid) {
      return;
    }
    const {careTimeLength, start, end} = form;

    this.workHoursManagement.careTimeLength = careTimeLength;

    const startStr = this.parseDateToHours(start);
    const endStr = this.parseDateToHours(end);

    const startHour = startStr.split(':')[0];
    const endHour = endStr.split(':')[0];

    this.selectedDays.forEach(d => {
      d.timeRange.startTime = Number(startHour);
      d.timeRange.endTime = Number(endHour);

      let dailyWorkHours = this.workHoursManagement.workHours;
      const index = dailyWorkHours.findIndex(workHours => workHours.dayInTheWeek === d.dayInTheWeek);
      if (index !== -1) {
        dailyWorkHours[index] = {...dailyWorkHours[index], ...d} as DailyWorkHours;
      } else {
        throw new Error('שגיאה חמורה התרחשה, צור קשר עם מנהל');
      }
    })

    await this.remult.repo(WorkHoursManagement).save(this.workHoursManagement);

    this.formGroup.reset();

    this.resetSelectedDays();

    this.dialogService.alert('בוצע בהצלחה', 'עדכון השעות השבועיות בוצע בהצלחה', 'done')
      .pipe(untilDestroyed(this))
      .subscribe(res => console.log(res))
  }


  onClick(i: DailyWorkHours) {
    const active = document.getElementById(String(i.dayInTheWeek));
    const index = this.selectedDays.findIndex(r => r.dayInTheWeek === i.dayInTheWeek);
    if (index !== -1) {
      if (active) {
        active.style.outline = 'none';
      }
      this.selectedDays.splice(index, 1);
    } else {
      if (active) {
        active.style.outline = '2px solid #407BE7';
      }
      this.selectedDays.push(i);
    }
    if (this.selectedDays.length > 0) {
      this.daysDisplay = this.selectedDays.map(d => {
        return d.dayInTheWeek
      })
    } else {
      this.daysDisplay = [];
    }
  }

  get careTimeLength() {
    return this.formGroup.get('careTimeLength') as FormControl
  }

  get start() {
    return this.formGroup.get('start') as FormControl
  }

  get end() {
    return this.formGroup.get('end') as FormControl
  }

  onLoadImage() {
    this.imageLoad = true;
  }

  onSelectDate(event: any) {
    this.selectedDate = event.value;
  }

  private resetSelectedDays(): void {
    this.selectedDays = [];
  }

  private parseDateToHours(date: Date): string {
    const momObj = moment(date);
    return momObj.format('HH:mm:ss');
  }

}
