import {BackendMethod, Controller, ControllerBase} from 'remult';
import {WorkHoursManagement} from './WorkHoursManagement';

@Controller('WorkHoursManagementController')
export class WorkHoursManagementController extends ControllerBase {

  @BackendMethod({allowed: true})
  async saveWorkHoursManagement(workHoursManagement: WorkHoursManagement) {
    try {
      const whmRepo = this.remult.repo(WorkHoursManagement);
      await whmRepo.insert(workHoursManagement);
    } catch (e) {
      throw new Error('לא ניתן לשמור מערכת שעות עבודה.')
    }
  }
}
