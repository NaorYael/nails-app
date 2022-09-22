import {BackendMethod, Controller, ControllerBase, Fields, UserInfo} from "remult";
import {User} from "./User";
import {Roles} from '../app/models/roles'

@Controller('userController')
export class UserController extends ControllerBase {


  @Fields.object()
  user = new User();
  static sendSMS: (text: string, number: string) => void;

  @BackendMethod({allowed: true})
  async loginOtp() {

    const userRepo = this.remult.repo(User);
    const random = String(this.generateOtpCode());

    let userFromDB = await userRepo.findId(this.user.phone!);
    if (userFromDB === undefined) {
      this.user.password = random;
      await userRepo.insert(this.user);
      await UserController.sendSMS(random, this.user.phone!);
    } else {
      userFromDB.password = random;
      this.user = await userRepo.save(userFromDB);
      await UserController.sendSMS(random, userFromDB.phone!);
    }

  }

  @BackendMethod({ allowed: true })
   async signIn() {
    let result: UserInfo | undefined;
    const userRepo = this.remult.repo(User);
    const userFromDB = await userRepo.findId(this.user.phone!);

    if (!userFromDB || userFromDB.password !== this.user.password)
      throw new Error("משתמש לא מזוהה");
    const user:UserInfo = {
      id:userFromDB.phone!,
      name:userFromDB.username!,
      roles:[]
    };
    if (userFromDB.admin) {
      user.roles.push(Roles.admin);
    }
    return (await import('jsonwebtoken')).sign(user, process.env['JWT_SECRET'] || "my secret");
  }

  private generateOtpCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

