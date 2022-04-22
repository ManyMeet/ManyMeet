import { Migration } from '@mikro-orm/migrations';

export class Migration20220421130956 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_calendar_calendar_uuid_foreign";');

    this.addSql('alter table "event" rename column "calendar_calendar_uuid" to "calendar_uuid";');
    this.addSql('alter table "event" add constraint "event_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("calendar_uuid") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_calendar_uuid_foreign";');

    this.addSql('alter table "event" rename column "calendar_uuid" to "calendar_calendar_uuid";');
    this.addSql('alter table "event" add constraint "event_calendar_calendar_uuid_foreign" foreign key ("calendar_calendar_uuid") references "calendar" ("calendar_uuid") on update cascade;');
  }

}
