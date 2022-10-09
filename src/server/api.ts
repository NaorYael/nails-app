import {remultExpress} from 'remult/remult-express';
import {Event} from '../shared/entities/Event'
import {EventsController} from '../shared/controllers/EventsController'
import {User} from '../shared/entities/User';
import {UserController} from '../shared/controllers/UserController';
import {createPostgresConnection} from 'remult/postgres';
import {WorkHoursManagementController} from '../shared/controllers/WorkHoursManagementController'
import {WorkHoursManagement} from '../shared/entities/WorkHoursManagement';

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
  const eventsController = new EventsController(remult);
  const x = await eventsController.getNextEventOfUser('+972524854478');
  console.log(x)
  }
});
