import {remultExpress} from 'remult/remult-express';
import {Event} from '../shared/Event'
import {EventsController} from '../shared/EventsController'
import {User} from '../shared/User';
import {UserController} from '../shared/UserController';
import {createPostgresConnection} from 'remult/postgres';
import {WorkHoursManagementController} from '../shared/WorkHoursManagementController'
import {WorkHoursManagement} from '../shared/WorkHoursManagement';

export const api = remultExpress({
  dataProvider: async () => {
    if (process.env['NODE_ENV'] === 'production')
      return createPostgresConnection({configuration: 'heroku'});
    return undefined;
  },

  entities: [Event, User, WorkHoursManagement],
  controllers: [EventsController, UserController, WorkHoursManagementController],
  initApi: async remult => {
    const workHoursManRepo = remult.repo(WorkHoursManagement);
    if (await workHoursManRepo.count() === 0) {
      await workHoursManRepo.save(new WorkHoursManagement());
    }
  // const eventsController = new EventsController(remult);
  // const x = await eventsController.syncEvents();
  // console.log(x)
  }
});
