
export interface Creator {
  email: string;
}

export interface Organizer {
  email: string;
  displayName: string;
  self: boolean;
}

export interface Start {
  dateTime: Date;
  timeZone: string;
}

export interface End {
  dateTime: Date;
  timeZone: string;
}

export interface Reminders {
  useDefault: boolean;
}

export interface GoggleEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: Date;
  updated: Date;
  summary: string;
  description: string;
  creator: Creator;
  organizer: Organizer;
  start: Start;
  end: End;
  iCalUID: string;
  sequence: number;
  reminders: Reminders;
  eventType: string;
}
