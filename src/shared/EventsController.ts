import {Allow, BackendMethod, Controller, ControllerBase, Fields, Remult} from "remult";
import {Roles} from '../app/models/roles';
import {Event} from './Event';

@Controller('eventsController')
export class EventsController extends ControllerBase {

  static addEvent: (event:any) => Promise<any>;
  static getEvents: () => Promise<any>;
  static watchEvents: () => Promise<any>;

   @BackendMethod({ allowed: true})
  async createEventOnGoggleCalendar(e: any) {
   return await EventsController.addEvent(e);
  }

  @BackendMethod({ allowed: true})
  async getEventsFromGoggleCalendar() {
   return await EventsController.getEvents();
  }

  @BackendMethod({ allowed: true})
  async watchEvents() {
   return await EventsController.watchEvents();
  }

  @BackendMethod({allowed:true})
  async syncEvents(){
    const googleEvents:any[] = await this.getEventsFromGoggleCalendar();
    const myEvents =  await this.remult.repo(Event).find();
    for (const eventElement of myEvents) {
      if (!googleEvents.find((e: any) => e.id === eventElement.calendarId)) //not in google events
          await eventElement.delete();
    }

  }

}
