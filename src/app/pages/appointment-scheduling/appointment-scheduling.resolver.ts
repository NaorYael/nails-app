import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {WorkHourService} from "../../services/work-hour.service";
import {Remult} from "remult";

@Injectable({
  providedIn: 'root'
})
export class AppointmentSchedulingResolver implements Resolve<boolean> {
  constructor(private workHourService: WorkHourService,
              private remult: Remult
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.workHourService.getWorkHour()?.value?.careTimeLength) {
      return of(true);
    } else {
      this.workHourService.setWorkHour().then(r => {
        return of(true);
      });
    }
    return of(false);
  }
}
