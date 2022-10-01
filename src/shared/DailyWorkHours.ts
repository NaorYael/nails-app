export class DailyWorkHours {
  dayInTheWeek = 0;
  timeRange!: TimeRange;
  breaks: Array<TimeRange> = [];

  constructor(dayInTheWeek: number) {
    this.dayInTheWeek = dayInTheWeek;
    this.timeRange = {endTime: undefined, startTime: undefined} as TimeRange;
  }
}

export interface TimeRange {
  startTime?: number;
  endTime?: number;
}
