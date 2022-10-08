import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'days'
})
export class DaysPipe implements PipeTransform {

  transform(value: number, values?: number[]): string {
    if (+value !== -1) {
      return this.getValue(value);
    } else if (values) {
      let s = '';
      values.forEach(v => {
        s = `${s.length > 0 ? s + ',' : s} ${this.getValue(v)}`;
      })
      return s;
    } else {
      return this.getValue(value);
    }
  }

  private getValue(value: number): string {
    switch (value) {
      case 0:
        return 'ראשון';
      case 1:
        return 'שני';
      case 2:
        return 'שלישי';
      case 3:
        return 'רביעי';
      case 4:
        return 'חמישי';
      case 5:
        return 'שישי';
      case 6:
        return 'שבת';
      default: return 'יום לא ידוע';
    }
  }

}
