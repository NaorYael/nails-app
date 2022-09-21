import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

export interface WorkHour {
  day: string;
  start: number;
  end: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkHourService {

  private workHour$ = new BehaviorSubject<Array<WorkHour>>([]);

  selectedWorkHour$ = this.workHour$.asObservable();

  setWorkHour(workHour: any) {
    this.workHour$.next(workHour);
  }
}
