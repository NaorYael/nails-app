import {BackendMethod, Controller, ControllerBase, Fields} from "remult";
import {User} from "./User";

@Controller('userController')
export class UserController extends ControllerBase {


  @Fields.object()
  user = new User();
  static sendSMS: (code: string, phone: string) => void;

  @BackendMethod({allowed: true})
  async loginOtp() {

    const userRepo = this.remult.repo(User);
    const random = String(this.generateOtpCode());

    let userFromDB = await userRepo.findId(this.user.phone!);
    console.log(userFromDB);
    if (userFromDB === undefined) {
      this.user.password = random;
      await userRepo.insert(this.user);
      await UserController.sendSMS(random, this.user.phone!);
    } else {
      userFromDB.password = random;
      this.user = await userRepo.save(userFromDB);
      console.log(random, userFromDB.phone);
      await UserController.sendSMS(random, userFromDB.phone!);
    }

  }

  private generateOtpCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
