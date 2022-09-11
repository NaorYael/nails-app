import {Allow, BackendMethod, Controller, ControllerBase, Fields, Remult} from "remult";
import {Roles} from '../app/models/roles';
import {Event} from './Event';

@Controller('eventsController')
export class EventsController extends ControllerBase {

  static addEvent: (event:any) => Promise<void>;

  @Fields.object()
  event = new Event();

  @BackendMethod({ allowed: Allow.authenticated} )
  async createEvent() {
    const eventRepo = this.remult.repo(Event);
    if (this.event) {
      await eventRepo.insert(this.event);
    }
  }

  @BackendMethod({allowed: Allow.authenticated})
  async createEventOnGoggleCalendar() {

    const TIMEOFFSET = '+03:00'

    const dateTimeForCalendar = () => {
      let date = new Date();

      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = +`0${month}`;
      }
      let day = date.getDate();
      if (day < 10) {
        day = +`0${day}`;
      }
      let hour = date.getHours();
      if (hour < 10) {
        hour = +`0${hour}`;
      }
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = +`0${minutes}`;
      }

      let newDateTime = `${year}-${month}-${day}T${hour}:${minutes}:00.000${TIMEOFFSET}`;

      let startDate = new Date(Date.parse(newDateTime));
      let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));

      return {'start': startDate, 'end': endDate}
    };

    // console.log(dateTimeForCalendar())

    await EventsController.addEvent({});

  }
}
