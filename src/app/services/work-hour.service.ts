import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import {WorkHoursManagement} from "../../shared/WorkHoursManagement";


@Injectable({
  providedIn: 'root'
})
export class WorkHourService {

  private workHour$ = new BehaviorSubject<WorkHoursManagement>({} as WorkHoursManagement);

  getWorkHour() {
    return this.workHour$;
  }

  setWorkHour(workHour: WorkHoursManagement) {
    this.workHour$.next(workHour);
  }
}
