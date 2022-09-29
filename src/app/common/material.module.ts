import {NgModule} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {MatStepperModule} from "@angular/material/stepper";
import {MatMenuModule} from "@angular/material/menu";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTimepickerModule} from "mat-timepicker";
import {MatDialogModule} from "@angular/material/dialog";

const modules = [
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatSelectModule,
  MatRadioModule,
  MatGridListModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatStepperModule,
  MatSelectModule,
  MatMenuModule,
  MatChipsModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTimepickerModule,
  MatDialogModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {
}
