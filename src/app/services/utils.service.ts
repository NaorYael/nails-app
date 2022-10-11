import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  static isNotEmptyAndNotUndefined(obj: Object): boolean {
    return obj !== {} && !!obj;
  }

  static isEmptyObject(obj: Object): boolean {
    return (obj && (Object.keys(obj).length === 0));
  }
}
