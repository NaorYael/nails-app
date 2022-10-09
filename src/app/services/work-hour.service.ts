import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import {WorkHoursManagement} from "../../shared/entities/WorkHoursManagement";
import {Remult} from "remult";


@Injectable({
  providedIn: 'root'
})
export class WorkHourService {

  constructor(private remult: Remult
  ) {
  }

  private workHour$ = new BehaviorSubject<WorkHoursManagement>({} as WorkHoursManagement);

  getWorkHour() {
    return this.workHour$;
  }

  async setWorkHour(workHour?: WorkHoursManagement) {
    if (!workHour || this.workHour$.value?.workHours === undefined) {
      const workHoursManRepo = this.remult.repo(WorkHoursManagement);
      await this.workHour$.next(await workHoursManRepo.findFirst());
    }else {
      this.workHour$.next(workHour);
    }
  }
}
