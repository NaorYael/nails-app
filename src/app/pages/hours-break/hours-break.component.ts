import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {HotToastService} from '@ngneat/hot-toast'

@Component({
  selector: 'app-hours-break',
  templateUrl: './hours-break.component.html',
  styleUrls: ['./hours-break.component.scss']
})
export class HoursBreakComponent implements OnInit {

  formGroup!: FormGroup;

  selectedDate = new Date();
  minDate = new Date();
  imageLoad = false;
  imageSource = '../../../assets/logo.jpeg';

  constructor(private fb: FormBuilder,
              private toast: HotToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      'date': [null, Validators.required],
      'start': [null, Validators.required],
      'end': [null, Validators.required]
    })
  }

  get date() {
    return this.formGroup.get('date') as FormControl
  }

  get start() {
    return this.formGroup.get('date') as FormControl
  }

  get end() {
    return this.formGroup.get('date') as FormControl
  }

  onLoadImage() {
    this.imageLoad = true;
  }

  onSelectDate(event: any) {
    console.log(event)
    this.selectedDate = event.value;
  }

  onSubmit(timestamp: any) {
    if (timestamp.invalid) {
      return;
    }
    console.log(timestamp)
    // TODO send timestamp to setInitWorkHoursAndBreak method (...home.component.ts) line 164
    this.formGroup.reset();
    this.router.navigate(['']);
    this.toast.success('עדכון ביומן בוצע בהצלחה');
  }
}
