import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {HotToastService} from '@ngneat/hot-toast'
import * as moment from 'moment'
import {WorkHourService} from '../../services/work-hour.service'
import {Rule} from '../../../shared/Rule'
import {Remult} from 'remult'

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss']
})
export class DaysComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    'start': [null, Validators.required],
    'end': [null, Validators.required]
  });

  selectedDate = new Date();

  // minDate = new Date().setHours(9);
  maxDate = new Date().setHours(19);
  imageLoad = false;
  imageSource = '../../../assets/logo.jpeg';
  confirmBtn: any
  cancelBtn: any

  rules: Array<Rule> = [];
  selectedRules: Array<Rule> = [];

  constructor(private fb: FormBuilder,
              private toast: HotToastService,
              private workHourService: WorkHourService,
              private remult: Remult,
              private router: Router) {
  }

  minDate() {
    const event = new Date('August 19, 1975 23:15:30');
    event.setHours(20);

    console.log(event);
// expected output: Tue Aug 19 1975 20:15:30 GMT+0200 (CEST)
// (note: your timezone may vary)

    event.setHours(20, 21, 22);

    console.log(event);
// expected output: Tue Aug 19 1975 20:21:22 GMT+0200 (CEST)
    return event;

  }

  async ngOnInit() {
    const ruleRepo = this.remult.repo(Rule);
    this.rules = await ruleRepo.find();

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

  async onSubmit(form: any) {
    if (form.invalid) {
      return;
    }
    const {start, end} = form;

    const startStr = this.parseDateToHours(start);
    const endStr = this.parseDateToHours(end);

    const startHour = startStr.split(':')[0];
    const endHour = endStr.split(':')[0];

    this.selectedRules.forEach(r => {
      r.startTime = Number(startHour);
      r.endTime = Number(endHour);

      const index = this.rules.findIndex(rule => rule.dayInTheWeek === r.dayInTheWeek);
      if (index !== -1) {
        this.rules[index] = {...this.rules[index], ...r} as Rule;
      } else {
        throw new Error('שגיאה חמורה התרחשה, צור קשר עם מנהל');
      }
    })

    await this.remult.repo(Rule).save(this.selectedRules);

    this.formGroup.reset();
    await this.router.navigate(['']);
    this.toast.success('העדכון ביומן בוצע בהצלחה');
  }

  private parseDateToHours(date: Date): string {
    const momObj = moment(date);
    return momObj.format('HH:mm:ss');
  }

  onClick(i: Rule) {
    const active = document.getElementById(String(i.dayInTheWeek));
    const index = this.selectedRules.findIndex(r => r.dayInTheWeek === i.dayInTheWeek);
    if (index !== -1) {
      if (active) {
        active.style.outline = 'none';
      }
      this.selectedRules.splice(index, 1);
    } else {
      if (active) {
        active.style.outline = '2px solid #407BE7';
      }
      this.selectedRules.push(i)
    }
  }
}
