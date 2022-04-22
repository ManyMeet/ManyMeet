import { Migration } from '@mikro-orm/migrations';

export class Migration20220421131224 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_calendars" drop constraint "user_calendars_calendar_calendar_uuid_foreign";');

    this.addSql('alter table "participant" drop constraint "participant_calendar_calendar_uuid_foreign";');

    this.addSql('alter table "event" drop constraint "event_calendar_calendar_uuid_foreign";');

    this.addSql('alter table "calendar" drop constraint "calendar_pkey";');
    this.addSql('alter table "calendar" rename column "calendar_uuid" to "uuid";');
    this.addSql('alter table "calendar" add constraint "calendar_pkey" primary key ("uuid");');

    this.addSql('alter table "user_calendars" drop constraint "user_calendars_pkey";');
    this.addSql('alter table "user_calendars" rename column "calendar_calendar_uuid" to "calendar_uuid";');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_pkey" primary key ("user_id", "calendar_uuid");');

    this.addSql('alter table "participant" rename column "calendar_calendar_uuid" to "calendar_uuid";');
    this.addSql('alter table "participant" add constraint "participant_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade;');

    this.addSql('alter table "event" rename column "calendar_calendar_uuid" to "calendar_uuid";');
    this.addSql('alter table "event" add constraint "event_calendar_uuid_foreign" foreign key ("calendar_uuid") references "calendar" ("uuid") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_calendars" drop constraint "user_calendars_calendar_uuid_foreign";');

    this.addSql('alter table "participant" drop constraint "participant_calendar_uuid_foreign";');

    this.addSql('alter table "event" drop constraint "event_calendar_uuid_foreign";');

    this.addSql('alter table "calendar" drop constraint "calendar_pkey";');
    this.addSql('alter table "calendar" rename column "uuid" to "calendar_uuid";');
    this.addSql('alter table "calendar" add constraint "calendar_pkey" primary key ("calendar_uuid");');

    this.addSql('alter table "user_calendars" drop constraint "user_calendars_pkey";');
    this.addSql('alter table "user_calendars" rename column "calendar_uuid" to "calendar_calendar_uuid";');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_calendar_calendar_uuid_foreign" foreign key ("calendar_calendar_uuid") references "calendar" ("calendar_uuid") on update cascade on delete cascade;');
    this.addSql('alter table "user_calendars" add constraint "user_calendars_pkey" primary key ("user_id", "calendar_calendar_uuid");');

    this.addSql('alter table "participant" rename column "calendar_uuid" to "calendar_calendar_uuid";');
    this.addSql('alter table "participant" add constraint "participant_calendar_calendar_uuid_foreign" foreign key ("calendar_calendar_uuid") references "calendar" ("calendar_uuid") on update cascade;');

    this.addSql('alter table "event" rename column "calendar_uuid" to "calendar_calendar_uuid";');
    this.addSql('alter table "event" add constraint "event_calendar_calendar_uuid_foreign" foreign key ("calendar_calendar_uuid") references "calendar" ("calendar_uuid") on update cascade;');
  }

}
