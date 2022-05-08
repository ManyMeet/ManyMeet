import { EntityRepository } from '@mikro-orm/postgresql';
import { Calendar } from './calendar.entity';

export class CalendarRepository extends EntityRepository<Calendar> {}
