import {BackendMethod, Controller, ControllerBase} from "remult";
import {Roles} from '../app/models/roles';
import {Event} from './Event';

@Controller('eventsController')
export class EventsController extends ControllerBase {

  static addEvent: (event: any) => Promise<any>;
  static getEvents: () => Promise<any>;
  static syncEvents: () => Promise<any>;

  @BackendMethod({allowed: true})
  async createEventOnGoggleCalendar(e: any) {
    return await EventsController.addEvent(e);
  }

  @BackendMethod({allowed: true})
  async getEventsFromGoggleCalendar() {
    return await EventsController.getEvents();
  }

  // @BackendMethod({ allowed: true})
  // async watchEvents() {
  //  return await EventsController.watchEvents();
  // }

  @BackendMethod({allowed: true})
   async syncEvents() {
    const googleEvents: GoggleEvent[] = await this.getEventsFromGoggleCalendar();
    const myEvents: Event[] = await this.remult.repo(Event).find();
    const nowMinusOneDay = new Date();
    nowMinusOneDay.setHours(nowMinusOneDay.getHours() - 24);

    const filteredGoggleEvents = googleEvents.filter(x => {
      const timeNowMinusOneDay = nowMinusOneDay.getTime();
      const timeGoogleEvent = new Date(x.start.dateTime).getTime();
      return timeNowMinusOneDay < timeGoogleEvent;
    });

    const filteredMyEvents = myEvents.filter(x => {
      const timeNowMinusOneDay = nowMinusOneDay.getTime();
      const timeEvent = new Date(x.id!).getTime();
      return timeNowMinusOneDay < timeEvent;
    });
    for (const myEvent of filteredMyEvents) {
      const index = filteredGoggleEvents.findIndex(goggleEvent => goggleEvent.id === myEvent.calendarId);
      if (index === -1) {
        await myEvent.delete();
      }
    }
  }

  @BackendMethod({allowed: Roles.admin})
  async setWorkHours(hours: string) {
    console.log(hours)
  }
}


interface Creator {
  email: string;
}

interface Organizer {
  email: string;
  displayName: string;
  self: boolean;
}

interface Start {
  dateTime: Date;
  timeZone: string;
}

interface End {
  dateTime: Date;
  timeZone: string;
}

interface Reminders {
  useDefault: boolean;
}

interface GoggleEvent {
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



