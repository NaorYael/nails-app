import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading$: Observable<boolean>;
  private loading: Subject<boolean>;

  constructor() {
    this.loading = new Subject<boolean>();
    this.loading$ = this.loading.asObservable();
  }
  public updateLoading(loading: boolean): void {
    this.loading.next(loading);
  }
}




