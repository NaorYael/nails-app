import {ErrorHandler, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfirmComponent} from './otp-auth/confirm/confirm.component'
import {LoginComponent} from './otp-auth/login/login.component'
import {AppointmentSchedulingComponent} from './pages/appointment-scheduling/appointment-scheduling.component'
import {AuthGuard} from './otp-auth/auth.guard'
import {NotFoundComponent} from "./pages/not-found.component";
import {ProfileComponent} from './pages/profile/profile.component'
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component'
import {AdminGuard} from "./otp-auth/admin.guard";
import {ShowDialogOnErrorErrorHandler} from "./common/dialog/show-dialog-on-error-error-handler";
import {AppointmentSchedulingResolver} from "./pages/appointment-scheduling/appointment-scheduling.resolver";

const routes: Routes = [
  {path: '', component: AppointmentSchedulingComponent, canActivate: [AuthGuard], resolve: [AppointmentSchedulingResolver]},
  {path: 'login', component: LoginComponent},
  {path: 'confirm', component: ConfirmComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'days', component: AdminDashboardComponent, canActivate: [AdminGuard, AuthGuard]},
  {path: '**', redirectTo: '', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],

})
export class AppRoutingModule {
}
