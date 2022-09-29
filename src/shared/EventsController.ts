import {BackendMethod, Controller, ControllerBase} from "remult";
import {Event} from './Event';
import {GoggleEvent} from "../app/models/google-event";

@Controller('eventsController')
export class EventsController extends ControllerBase {

  static addEvent: (event: any) => Promise<any>;
  static getEvents: () => Promise<any>;

  @BackendMethod({allowed: true})
  async createEventOnGoggleCalendar(e: any) {
    return await EventsController.addEvent(e);
  }

  @BackendMethod({allowed: true})
  async getEventsFromGoggleCalendar() {
    return await EventsController.getEvents();
  }

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
}

