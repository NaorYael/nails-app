import {BackendMethod, Controller, ControllerBase, Fields} from "remult";
import {User} from "./User";

@Controller('userController')
export class UserController extends ControllerBase {


  @Fields.object()
  user = new User();
  static sendSMS:(code: number, phone: string) => void;

  @BackendMethod({allowed: true})
  async loginOtp() {

    const userRepo = this.remult.repo(User);
    const random = this.generateOtpCode();

    if (await userRepo.count() === 0) {
      this.user.password = String(random);
      await userRepo.insert(this.user);
      await UserController.sendSMS(random, this.user.phone!);
    } else {
      for (let user of await userRepo.find()) {
        user.password = String(random);
        await userRepo.save(user);
        console.log(random, user.phone);
       await UserController.sendSMS(random,user.phone!);
      }
    }

  }

  private generateOtpCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
