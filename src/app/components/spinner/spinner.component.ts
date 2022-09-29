import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  mode = 'indeterminate';
  value = 50;

  constructor() { }

  ngOnInit(): void {
  }

}
