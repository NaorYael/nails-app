import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private event$ = new BehaviorSubject<boolean>(false);

  selectedEvent$ = this.event$.asObservable();

  setEvent(event: any) {
    this.event$.next(event);
  }
}
