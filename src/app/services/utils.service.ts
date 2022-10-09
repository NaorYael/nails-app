import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  static isNotEmptyAndNotUndefined(obj: Object): boolean {
    return obj !== {} && !!obj;
  }
}
