import { remultExpress } from 'remult/remult-express';
import {Event} from '../shared/Event'
import {EventsController} from '../shared/EventsController'
import {User} from "../shared/User";
import {UserController} from "../shared/UserController";

export const api = remultExpress({
  entities: [Event, User],
  controllers: [EventsController, UserController],
  // initApi: async remult => { }
});
