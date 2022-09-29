import {TimeRange} from "./time-range";

export interface WorkHours {
  blanks: Array<TimeRange>;
  hours: TimeRange;
}
