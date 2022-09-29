import {Component, ErrorHandler, Injectable, NgZone} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "./dialog.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Injectable()
export class ShowDialogOnErrorErrorHandler extends ErrorHandler {
  constructor(private dialogService: DialogService, private zone: NgZone) {
    super();
  }

  lastErrorString = '';
  errMsg = '';
  lastErrorTime!: number;

  override async handleError(error: any) {
    super.handleError(error);
    if (this.lastErrorString == error.toString() && new Date().valueOf() - this.lastErrorTime < 100)
      return;
    this.lastErrorString = error.toString();
    this.lastErrorTime = new Date().valueOf();
    this.zone.run(() => {
      this.errMsg = extractError(error);
      this.dialogService.alert('שגיאה', this.errMsg)
        .pipe(untilDestroyed(this))
        .subscribe(res => console.log(res))
    });
  }
}


export function extractError(err: any): string {
  if (typeof err === 'string')
    return err;
  if (err.modelState) {
    if (err.message)
      return err.message;
    for (const key in err.modelState) {
      if (err.modelState.hasOwnProperty(key)) {
        const element = err.modelState[key];
        return key + ": " + element;

      }
    }
  }
  if (err.rejection)
    return extractError(err.rejection);//for promise failed errors and http errors
  if (err.message) {
    let r = err.message;
    if (err.error && err.error.message)
      r = err.error.message;
    return r;
  }
  if (err.error)
    return extractError(err.error);


  return JSON.stringify(err);
}
