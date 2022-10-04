import {Allow, Entity, EntityBase, Fields, getEntityRef, isBackend, Validators} from "remult";

@Entity<Event>("events", {
  allowApiCrud: Allow.authenticated
})
export class Event extends EntityBase {
  @Fields.number({
    validate: Validators.unique.withMessage('לא ניתן לקבוע פגישה מכיוון שהשעה הזו תפוסה'), caption: 'אנא בחר מועד אחר',
  })
  id?: number;

  @Fields.string()
  title? = '';

  @Fields.string()
  subtitle? = '';

  @Fields.boolean()
  completed? = false;

  @Fields.boolean()
  isAvailable? = false;

  @Fields.string()
  username? = '';

  @Fields.number()
  time? = 0;

  @Fields.string()
  url? = '';

  @Fields.string()
  description? = '';

  @Fields.string()
  phone? = '';

  @Fields.string()
  calendarId? = '';

  @Fields.number()
  price? = 0;

  @Fields.date()
  date: Date = new Date();
}
