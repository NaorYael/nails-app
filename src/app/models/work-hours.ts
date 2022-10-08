export interface WorkHours {
  blanks: Array<TimeRange>;
  hours: TimeRange;
}

export interface TimeRange {
  startTime: Date;
  endTime: Date;
}
