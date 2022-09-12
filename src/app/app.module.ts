import {NgModule} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppComponent} from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSelectModule} from '@angular/material/select'
import {MatIconModule} from '@angular/material/icon'
import {MatListModule} from '@angular/material/list'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatInputModule} from '@angular/material/input'
import {MatRadioModule} from '@angular/material/radio'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatCardModule} from '@angular/material/card'
import {MatNativeDateModule} from '@angular/material/core'
import {MatButtonModule} from '@angular/material/button';
import {PopupModule} from './components/popup/popup.module'
import {MatStepperModule} from "@angular/material/stepper";
import {MatMenuModule} from '@angular/material/menu';
import {CardComponent} from './components/card/card.component';
import {MatChipsModule} from '@angular/material/chips';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Remult} from 'remult';
import {MatSnackBarModule} from '@angular/material/snack-bar';
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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SpinnerComponent } from './components/spinner/spinner.component'

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
  ],
  imports: [
    NoopAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    MatGridListModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    FlexLayoutModule,
    MatStepperModule,
    MatSelectModule,
    MatMenuModule,
    PopupModule,
    MatChipsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgxMatIntlTelInputComponent,
    CodeInputModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: Remult, useClass: Remult, deps: [HttpClient]}
  ],

})
export class AppModule {
}
