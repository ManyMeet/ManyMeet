import { Migration } from '@mikro-orm/migrations';

export class Migration20220418164736 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "calendar" ("uuid" varchar(255) not null);');
    this.addSql('alter table "calendar" add constraint "calendar_pkey" primary key ("uuid");');

    this.addSql('create table "user_calendars" ("user_id" int not null, "calendar_uuid" varchar(255) not null);');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_pkey" primary key ("user_id", "calendar_uuid");');

    this.addSql('alter table "user_calendars" add constraint "user_calendars_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_calendars" drop constraint "user_calendars_calendar_uuid_foreign";');

    this.addSql('drop table if exists "calendar" cascade;');

    this.addSql('drop table if exists "user_calendars" cascade;');
  }

}
