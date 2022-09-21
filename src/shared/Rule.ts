import {Entity, EntityBase, Fields} from "remult";

@Entity<Rule>("rules", {
  allowApiCrud: true
})
export class Rule extends EntityBase {

  @Fields.number()
  dayInTheWeek? = 0;

  @Fields.number()
  startTime? = 0;

  @Fields.number()
  endTime? = 0;

  @Fields.number()
  cateTime? = 2;



}
