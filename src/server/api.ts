import { remultExpress } from 'remult/remult-express';
import {Event} from '../shared/Event'
import {EventsController} from '../shared/EventsController'
import {User} from "../shared/User";
import {UserController} from "../shared/UserController";
import {createPostgresConnection} from "remult/postgres";
import {Rule} from '../shared/Rule'
import {RulesController} from '../shared/RulesController'

export const api = remultExpress({
  dataProvider: async () => {
    if (process.env["NODE_ENV"] === "production")
      return createPostgresConnection({ configuration: "heroku" });
    return undefined;
  },

  entities: [Event, User, Rule],
  controllers: [EventsController, UserController, RulesController],
  initApi: async remult => {
    const ruleRepo = remult.repo(Rule);
    if (await ruleRepo.count() === 0) {
      const rules: Rule[] = [];
      for (let i = 0; i < 7; i++) {
        rules.push({dayInTheWeek: i} as Rule)
      }
      await ruleRepo.insert(rules);
    }
 //   console.log( await eventRepo.find());
    // await userRepo.delete('+972545870318')

    // const x = await EventsController.watchEvents();
    // console.log({x});
  }
});
