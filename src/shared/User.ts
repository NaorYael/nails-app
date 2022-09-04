import {Entity, EntityBase, Fields} from "remult";

@Entity<User>("auth", {
  allowApiCrud: true
})
export class User extends EntityBase {

  @Fields.string()
  phone? = '';

  @Fields.string()
  username?: string;

  @Fields.string()
  password? = '';

  @Fields.date()
  lastLoginDate? = new Date();

}
