import {Entity, EntityBase, Fields} from 'remult';
import {DailyWorkHours} from './DailyWorkHours';
import {Roles} from '../../app/models/roles';

@Entity<WorkHoursManagement>('workHoursManagement', {
  allowApiCrud: Roles.admin
})
export class WorkHoursManagement extends EntityBase {

  @Fields.number()
  careTimeLength? = 1;

  @Fields.object()
  workHours: Array<DailyWorkHours> = [];

  constructor() {
    super();
    for (let i = 0; i < 7; i++) {
      this.workHours.push(new DailyWorkHours(i));
    }
  }
}
