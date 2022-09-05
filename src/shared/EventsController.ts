import {Allow, BackendMethod, Controller, ControllerBase, Fields, Remult} from "remult";
import {Roles} from '../app/models/roles';
import {Event} from './Event';


@Controller('eventsController')
export class EventsController extends ControllerBase {

  @Fields.object()
  event = new Event();

  @BackendMethod({ allowed: Allow.authenticated} )
  async createEvent() {
    const eventRepo = this.remult.repo(Event);
    if (this.event) {
      await eventRepo.insert(this.event);
    }
  }
}
