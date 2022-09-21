import {BackendMethod, Controller, ControllerBase} from "remult";
import {Rule} from './Rule'

@Controller('RulesController')
export class RulesController extends ControllerBase {

  @BackendMethod({allowed: true})
  async saveRules(rules: Rule[]) {
    try {
      const ruleRepo = this.remult.repo(Rule);
      await ruleRepo.insert(rules);
    } catch (e) {
      throw new Error('לא ניתן לשמור חוקים')
    }
  }
}
