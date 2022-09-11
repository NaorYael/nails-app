import {BackendMethod, Controller, ControllerBase, Fields} from "remult";
import {User} from "./User";

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

    const userRepo = this.remult.repo(User);
    const userFromDB = await userRepo.findId(this.user.phone!);

    if (!userFromDB || userFromDB.password !== this.user.password)
      throw new Error("Invalid user, try 'Steve' or 'Jane'");
    return (await import('jsonwebtoken')).sign(this.user, process.env['JWT_SECRET'] || "my secret");
  }

  private generateOtpCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

