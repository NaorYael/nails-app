import {NgModule} from '@angular/core';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppComponent} from './app.component';
import {CardComponent} from './components/card/card.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Remult} from 'remult';
import {ConfirmComponent} from './otp-auth/confirm/confirm.component';
import {LoginComponent} from './otp-auth/login/login.component';
import {AppointmentSchedulingComponent} from './pages/appointment-scheduling/appointment-scheduling.component'
import {NgxMatIntlTelInputComponent} from 'ngx-mat-intl-tel-input'
import {CodeInputModule} from 'angular-code-input';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component'
import {NotFoundComponent} from "./pages/not-found.component";
import {UsernameModalComponent} from "./components/username-modal/username-modal.component";
import {ProfileComponent} from './pages/profile/profile.component'
import {SpinnerComponent} from './components/spinner/spinner.component'
import {AuthService} from "./otp-auth/auth.service";
import {JwtModule} from "@auth0/angular-jwt";
import {NgxLoadingModule} from "ngx-loading";
import {DaysPipe} from './pipes/days.pipe'
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component'
import {DialogComponent} from './common/dialog/dialog.component';
import {MaterialModule} from "./common/material.module";
import {BrowserModule} from "@angular/platform-browser";
import { CollapseTogglerComponent } from './components/collapse-toggler/collapse-toggler.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    ConfirmComponent,
    LoginComponent,
    AppointmentSchedulingComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    UsernameModalComponent,
    ProfileComponent,
    SpinnerComponent,
    AdminDashboardComponent,
    DaysPipe,
    DialogComponent,
    CollapseTogglerComponent,
    WelcomeComponent

  ],
  imports: [
    // NoopAnimationsModule,
    BrowserAnimationsModule,
    LayoutModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxMatIntlTelInputComponent,
    CodeInputModule,
    MaterialModule,
    NgxLoadingModule.forRoot({}),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => AuthService.fromStorage()
      }
    })
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: Remult, useClass: Remult, deps: [HttpClient]}
  ],
})
export class AppModule {
}
