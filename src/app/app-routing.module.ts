import {ErrorHandler, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfirmComponent} from './otp/confirm/confirm.component'
import {LoginComponent} from './otp/login/login.component'
import {HomeComponent} from './pages/home/home.component'
import {AuthGuard} from './otp/auth.guard'
import {NotFoundComponent} from "./pages/not-found.component";
import {ProfileComponent} from './pages/profile/profile.component'
import {DaysComponent} from './pages/days/days.component'
import {AdminGuard} from "./otp/admin.guard";
import {ShowDialogOnErrorErrorHandler} from "./common/dialog/show-dialog-on-error-error-handler";
import {HomeResolver} from "./pages/home/home.resolver";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard], resolve: [HomeResolver]},
  {path: 'login', component: LoginComponent},
  {path: 'confirm', component: ConfirmComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'days', component: DaysComponent, canActivate: [AdminGuard, AuthGuard]},
  {path: '**', redirectTo: '', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],

})
export class AppRoutingModule {
}
