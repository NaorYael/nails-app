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
import {ConfirmComponent} from './otp/confirm/confirm.component';
import {LoginComponent} from './otp/login/login.component';
import {HomeComponent} from './pages/home/home.component'
import {NgxMatIntlTelInputComponent} from 'ngx-mat-intl-tel-input'
import {CodeInputModule} from 'angular-code-input';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component'
import {NotFoundComponent} from "./pages/not-found.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {UsernameComponent} from "./components/username/username.component";
import {ProfileComponent} from './pages/profile/profile.component'
import {SpinnerComponent} from './components/spinner/spinner.component'
import {AuthService} from "./otp/auth.service";
import {JwtModule} from "@auth0/angular-jwt";
import {NgxLoadingModule} from "ngx-loading";
import {PopupComponent} from './components/popup/popup.component'
import {DaysPipe} from './pages/home/days.pipe'
import {DaysComponent} from './pages/days/days.component'
import {DialogComponent} from './common/dialog/dialog.component';
import {MaterialModule} from "./common/material.module";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    ConfirmComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PaymentComponent,
    NotFoundComponent,
    UsernameComponent,
    ProfileComponent,
    SpinnerComponent,
    PopupComponent,
    DaysComponent,
    DaysPipe,
    DialogComponent

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
