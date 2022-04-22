import { Migration } from '@mikro-orm/migrations';

export class Migration20220420154238 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "event" drop constraint "event_calendar_uuid_foreign";');

    this.addSql('alter table "event" drop column "calendar_uuid";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "event" add column "calendar_uuid" varchar(255) not null;');
    this.addSql('alter table "event" add constraint "event_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade;');
  }

}
