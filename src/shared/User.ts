import {Entity, EntityBase, Fields, Validators} from "remult";

@Entity<User>("auth", {
  allowApiCrud: true
})
export class User extends EntityBase {

  @Fields.string({
    // validate: Validators.unique
  })
  phone? = '';

  @Fields.string()
  username?: string;

  @Fields.string()
  password? = '';

  @Fields.date()
  registrationDate? = new Date();

}
