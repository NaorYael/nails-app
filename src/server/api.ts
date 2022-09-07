import { remultExpress } from 'remult/remult-express';
import {Event} from '../shared/Event'
import {EventsController} from '../shared/EventsController'
import {User} from "../shared/User";
import {UserController} from "../shared/UserController";
import {createPostgresConnection} from "remult/postgres";

export const api = remultExpress({
  dataProvider: async () => {
    if (process.env["NODE_ENV"] === "production")
      return createPostgresConnection({ configuration: "heroku" });
    return undefined;
  },
  entities: [Event, User],
  controllers: [EventsController, UserController],
  initApi: async remult => {
    const userRepo = remult.repo(User);
      await userRepo.delete('+972545870318')
  }
});
