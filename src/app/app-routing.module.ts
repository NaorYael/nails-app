import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfirmComponent} from './otp/confirm/confirm.component'
import {LoginComponent} from './otp/login/login.component'
import {HomeComponent} from './pages/home/home.component'
import {AuthGuard} from './otp/auth.guard'
import {NotFoundComponent} from "./pages/not-found.component";
import {ProfileComponent} from './pages/profile/profile.component'
import {DaysComponent} from './pages/days/days.component'

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  // {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'confirm', component: ConfirmComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'days', component: DaysComponent},
  {path: '**', redirectTo: '', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
