import {Component, OnInit} from '@angular/core';
import {Remult} from "remult";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private remult: Remult, private router: Router) {
  }

  ngOnInit(): void {
    // // console.log(this.remult.authenticated());
    // if (this.remult.authenticated())
    // this.router.navigate(['/'])
    // // console.log(window.location.pathname);
  }


}
