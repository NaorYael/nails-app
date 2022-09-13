import {Allow, BackendMethod, Controller, ControllerBase, Fields, Remult} from "remult";
import {Roles} from '../app/models/roles';
import {Event} from './Event';

@Controller('eventsController')
export class EventsController extends ControllerBase {

  static addEvent: (event:any) => Promise<any>;

  @Fields.object()
  event = new Event();

  @BackendMethod({ allowed: true} )
  async createEvent() {
    const eventRepo = this.remult.repo(Event);
    if (this.event) {
      await eventRepo.insert(this.event);
    }
  }

  @BackendMethod({ allowed: true})
  async createEventOnGoggleCalendar(e: any) {
   return await EventsController.addEvent(e);
  }
}
